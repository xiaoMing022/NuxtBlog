---
title: Prometheus
date:  2025/9/18
description: 了解Prometheus的使用
image: /blogs-img/promethues.png
alt: How to fix vuex type issue
ogImage: /blogs-img/promethues.png
tags: ['promethues']
published: true
---

# Prometheus

## 一、入门

![Prometheus architecture](https://prometheus.ac.cn/assets/docs/architecture.svg)

### 1. **Prometheus Server（核心)**

Prometheus Server 是 Prometheus 体系的核心，定期从 Exporters 和 Pushgateway 拉取数据，存储在时序数据库中，并执行规则计算，内部包含两个主要模块：

**Retrieval（抓取模块）**

- 定期向各个监控目标（Target）发送 HTTP 请求，抓取监控数据
- 抓取的地址和间隔在 `prometheus.yml` 中 `scrape_configs` 里定义

**TSDB（时间序列数据库）**

- 把抓取到的监控数据按时间序列存储
- 自动进行压缩和分片，支持高效的时间区间查询
- 默认本地存储，支持持久化和远程存储插件

### 2. PushGateway和**Exporters（数据采集器）**

Exporter 是部署在被监控目标上的小服务，用于**把系统指标暴露为 Prometheus 能理解的格式（/metrics）**。

- 常见 Exporter：
  - Node Exporter：监控主机的 CPU、内存、磁盘、网络等
  - Blackbox Exporter：监控 HTTP、DNS、TCP 可用性
  - MySQL Exporter / Redis Exporter：监控特定服务的状态

PushGateWay主要适用于短时任务，而Exporter主要适用于长时间抓取任务

### 3. Service Discovery（服务发现）

自动发现目标节点（targets）的机制,支持静态配置、DNS、Kubernetes、Consul 等方式,用于避免手动维护大量 target 列表

### 4. PromQL（查询语言）

Prometheus 内置的查询语言

- 用于：

  - 在网页 UI 或 Grafana 中展示数据
  - 作为告警规则（alert rules）条件表达式

- 例如：

  ```
  node_cpu_seconds_total{mode="idle"}
  ```

------

### 5. Alertmanager（告警模块）

- 接收 Prometheus 发送的告警（alerts）
- 负责：
  - 告警去重、聚合、抑制
  - 发送通知（邮件 / Webhook / Slack / 飞书 / Telegram 等）
- 通过 `alerting` 配置与 Prometheus server 连接

------

### 6. Grafana（外部可视化）

- 虽然不属于 Prometheus 核心模块，但最常与 Prometheus 搭配使用
- 用于：
  - 编写 Dashboard（仪表盘）展示数据
  - 接收 Prometheus 数据源

------

### 📝 总结

| 组件                  | 作用                    |
| --------------------- | ----------------------- |
| **Prometheus Server** | 抓取指标 + 存储数据     |
| **Exporters**         | 把主机/服务状态暴露出来 |
| **Service Discovery** | 自动发现监控目标        |
| **PromQL**            | 数据查询与分析语言      |
| **Alertmanager**      | 接收告警并发送通知      |
| **Grafana**           | 美观的数据展示          |


### 一个小实例
***1. prometheus.yml配置文件的小实例***

```yaml
# my global config

#global 块控制 Prometheus 服务器的全局配置。
#我们有两个选项。第一个是 scrape_interval，它控制 Prometheus 抓取目标的频率。
#您可以为单个目标覆盖此设置。
#在此示例中，全局设置为每 15 秒抓取一次。evaluation_interval 选项控制 Prometheus 评估规则的频率。Prometheus 使用规则创建新的时间序列并生成告警。
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

#rule_files 块指定了我们希望 Prometheus 服务器加载的任何规则的位置。
#目前我们还没有规则。
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"



#scrape_configs，控制 Prometheus 监控哪些资源。
#由于 Prometheus 自身也通过 HTTP 端点暴露数据，因此它可以抓取并监控自身的健康状况。
#在默认配置中，有一个名为 prometheus 的单个作业，它抓取 Prometheus 服务器暴露的时间序列数据。
#该作业包含一个静态配置的目标，即端口 9090 上的 localhost。
scrape_configs:

  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

  # metrics_path defaults to '/metrics'
  # scheme defaults to 'http'.

    static_configs:
      - targets: ["localhost:9090"]
       # The label name is added as a label `label_name=<label_value>` to any timeseries scraped from this config.
        labels:
          app: "prometheus"

```

***2. 配置 Prometheus 监控示例目标***

现在我们将配置 Prometheus 来抓取这些新目标。让我们将所有三个端点分组到一个名为 `node` 的作业中。我们假设前两个端点是生产目标，而第三个则代表一个金丝雀实例。为了在 Prometheus 中实现这一点，我们可以向单个作业添加多个端点组，并为每个目标组添加额外的标签。在此示例中，我们将 `group="production"` 标签添加到第一组目标，同时将 `group="canary"` 添加到第二组。

为此，请将以下作业定义添加到您的 `prometheus.yml` 文件中的 `scrape_configs` 部分，然后重新启动您的 Prometheus 实例

```yaml
scrape_configs:
  - job_name:       'node'

    # Override the global default and scrape targets from this job every 5 seconds.
    scrape_interval: 5s

    static_configs:
      - targets: ['localhost:8080', 'localhost:8081']
        labels:
          group: 'production'

      - targets: ['localhost:8082']
        labels:
          group: 'canary'

```

***3.对Prometheus配置记录规则***

创建一个包含以下记录规则的文件，并将其保存为 `prometheus.rules.yml`

```yaml
groups:
- name: cpu-node
  rules:
  - record: job_instance_mode:node_cpu_seconds:avg_rate5m
    expr: avg by (job, instance, mode) (rate(node_cpu_seconds_total[5m]))
```

同时在`prometheus.yml` 中添加 `rule_files` 语句。同时需重启Prometheus来加载配置项

```yaml
global:
  scrape_interval:     15s # By default, scrape targets every 15 seconds.
  evaluation_interval: 15s # Evaluate rules every 15 seconds.

  # Attach these extra labels to all timeseries collected by this Prometheus instance.
  external_labels:
    monitor: 'codelab-monitor'

rule_files:
  - 'prometheus.rules.yml'

scrape_configs:
  - job_name: 'prometheus'

    # Override the global default and scrape targets from this job every 5 seconds.
    scrape_interval: 5s

    static_configs:
      - targets: ['localhost:9090']



  - job_name:       'node'
    # Override the global default and scrape targets from this job every 5 seconds.
    scrape_interval: 5s

    static_configs:
      - targets: ['localhost:8080', 'localhost:8081']
        labels:
          group: 'production'

      - targets: ['localhost:8082']
        labels:
          group: 'canary'
```

## 二、配置

Prometheus 通过命令行标志和配置文件进行配置。如果新配置格式不正确，则更改将不会应用。通过向 Prometheus 进程发送 `SIGHUP` 或向 `/-/reload` 端点发送 HTTP POST 请求（当启用了 `--web.enable-lifecycle` 标志时）来触发配置重新加载。这也会重新加载任何已配置的规则文件。

### 1.global(全局配置)

```yaml
global:
  # How frequently to scrape targets by default.
  [ scrape_interval: <duration> | default = 1m ]

  # How long until a scrape request times out.
  # It cannot be greater than the scrape interval.
  [ scrape_timeout: <duration> | default = 10s ]

  # The protocols to negotiate during a scrape with the client.
  # Supported values (case sensitive): PrometheusProto, OpenMetricsText0.0.1,
  # OpenMetricsText1.0.0, PrometheusText0.0.4.
  # The default value changes to [ PrometheusProto, OpenMetricsText1.0.0, OpenMetricsText0.0.1, PrometheusText0.0.4 ]
  # when native_histogram feature flag is set.
  [ scrape_protocols: [<string>, ...] | default = [ OpenMetricsText1.0.0, OpenMetricsText0.0.1, PrometheusText0.0.4 ] ]

  # How frequently to evaluate rules.
  [ evaluation_interval: <duration> | default = 1m ]

  # Offset the rule evaluation timestamp of this particular group by the
  # specified duration into the past to ensure the underlying metrics have
  # been received. Metric availability delays are more likely to occur when
  # Prometheus is running as a remote write target, but can also occur when
  # there's anomalies with scraping.
  [ rule_query_offset: <duration> | default = 0s ]

  # The labels to add to any time series or alerts when communicating with
  # external systems (federation, remote storage, Alertmanager).
  # Environment variable references `${var}` or `$var` are replaced according
  # to the values of the current environment variables.
  # References to undefined variables are replaced by the empty string.
  # The `$` character can be escaped by using `$$`.
  external_labels:
    [ <labelname>: <labelvalue> ... ]

  # File to which PromQL queries are logged.
  # Reloading the configuration will reopen the file.
  [ query_log_file: <string> ]

  # File to which scrape failures are logged.
  # Reloading the configuration will reopen the file.
  [ scrape_failure_log_file: <string> ]

  # An uncompressed response body larger than this many bytes will cause the
  # scrape to fail. 0 means no limit. Example: 100MB.
  # This is an experimental feature, this behaviour could
  # change or be removed in the future.
  [ body_size_limit: <size> | default = 0 ]

  # Per-scrape limit on the number of scraped samples that will be accepted.
  # If more than this number of samples are present after metric relabeling
  # the entire scrape will be treated as failed. 0 means no limit.
  [ sample_limit: <int> | default = 0 ]

  # Limit on the number of labels that will be accepted per sample. If more
  # than this number of labels are present on any sample post metric-relabeling,
  # the entire scrape will be treated as failed. 0 means no limit.
  [ label_limit: <int> | default = 0 ]

  # Limit on the length (in bytes) of each individual label name. If any label
  # name in a scrape is longer than this number post metric-relabeling, the
  # entire scrape will be treated as failed. Note that label names are UTF-8
  # encoded, and characters can take up to 4 bytes. 0 means no limit.
  [ label_name_length_limit: <int> | default = 0 ]

  # Limit on the length (in bytes) of each individual label value. If any label
  # value in a scrape is longer than this number post metric-relabeling, the
  # entire scrape will be treated as failed. Note that label values are UTF-8
  # encoded, and characters can take up to 4 bytes. 0 means no limit.
  [ label_value_length_limit: <int> | default = 0 ]

  # Limit per scrape config on number of unique targets that will be
  # accepted. If more than this number of targets are present after target
  # relabeling, Prometheus will mark the targets as failed without scraping them.
  # 0 means no limit. This is an experimental feature, this behaviour could
  # change in the future.
  [ target_limit: <int> | default = 0 ]

  # Limit per scrape config on the number of targets dropped by relabeling
  # that will be kept in memory. 0 means no limit.
  [ keep_dropped_targets: <int> | default = 0 ]

  # Specifies the validation scheme for metric and label names. Either blank or
  # "utf8" for full UTF-8 support, or "legacy" for letters, numbers, colons,
  # and underscores.
  [ metric_name_validation_scheme: <string> | default "utf8" ]

  # Specifies whether to convert all scraped classic histograms into native
  # histograms with custom buckets.
  [ convert_classic_histograms_to_nhcb: <bool> | default = false]

  # Specifies whether to scrape a classic histogram, even if it is also exposed as a native
  # histogram (has no effect without --enable-feature=native-histograms).
  [ always_scrape_classic_histograms: <boolean> | default = false ]


runtime:
  # Configure the Go garbage collector GOGC parameter
  # See: https://tip.golang.org/doc/gc-guide#GOGC
  # Lowering this number increases CPU usage.
  [ gogc: <int> | default = 75 ]

# Rule files specifies a list of globs. Rules and alerts are read from
# all matching files.
rule_files:
  [ - <filepath_glob> ... ]

# Scrape config files specifies a list of globs. Scrape configs are read from
# all matching files and appended to the list of scrape configs.
scrape_config_files:
  [ - <filepath_glob> ... ]

# A list of scrape configurations.
scrape_configs:
  [ - <scrape_config> ... ]

# Alerting specifies settings related to the Alertmanager.
alerting:
  alert_relabel_configs:
    [ - <relabel_config> ... ]
  alertmanagers:
    [ - <alertmanager_config> ... ]

# Settings related to the remote write feature.
remote_write:
  [ - <remote_write> ... ]

# Settings related to the OTLP receiver feature.
# See https://prometheus.ac.cn/docs/guides/opentelemetry/ for best practices.
otlp:
  # Promote specific list of resource attributes to labels.
  # It cannot be configured simultaneously with 'promote_all_resource_attributes: true'.
  [ promote_resource_attributes: [<string>, ...] | default = [ ] ]
  # Promoting all resource attributes to labels, except for the ones configured with 'ignore_resource_attributes'.
  # Be aware that changes in attributes received by the OTLP endpoint may result in time series churn and lead to high memory usage by the Prometheus server.
  # It cannot be set to 'true' simultaneously with 'promote_resource_attributes'.
  [ promote_all_resource_attributes: <boolean> | default = false ]
  # Which resource attributes to ignore, can only be set when 'promote_all_resource_attributes' is true.
  [ ignore_resource_attributes: [<string>, ...] | default = [] ]
  # Configures translation of OTLP metrics when received through the OTLP metrics
  # endpoint. Available values:
  # - "UnderscoreEscapingWithSuffixes" refers to commonly agreed normalization used
  #   by OpenTelemetry in https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/translator/prometheus
  # - "NoUTF8EscapingWithSuffixes" is a mode that relies on UTF-8 support in Prometheus.
  #   It preserves all special characters like dots, but still adds required metric name suffixes
  #   for units and _total, as UnderscoreEscapingWithSuffixes does.
  # - (EXPERIMENTAL) "NoTranslation" is a mode that relies on UTF-8 support in Prometheus.
  #   It preserves all special character like dots and won't append special suffixes for metric
  #   unit and type.
  #
  #   WARNING: The "NoTranslation" setting has significant known risks and limitations (see https://prometheus.ac.cn/docs/practices/naming/
  #   for details):
  #       * Impaired UX when using PromQL in plain YAML (e.g. alerts, rules, dashboard, autoscaling configuration).
  #       * Series collisions which in the best case may result in OOO errors, in the worst case a silently malformed
  #         time series. For instance, you may end up in situation of ingesting `foo.bar` series with unit
  #         `seconds` and a separate series `foo.bar` with unit `milliseconds`.
  [ translation_strategy: <string> | default = "UnderscoreEscapingWithSuffixes" ]
  # Enables adding "service.name", "service.namespace" and "service.instance.id"
  # resource attributes to the "target_info" metric, on top of converting
  # them into the "instance" and "job" labels.
  [ keep_identifying_resource_attributes: <boolean> | default = false ]
  # Configures optional translation of OTLP explicit bucket histograms into native histograms with custom buckets.
  [ convert_histograms_to_nhcb: <boolean> | default = false ]

# Settings related to the remote read feature.
remote_read:
  [ - <remote_read> ... ]

# Storage related settings that are runtime reloadable.
storage:
  [ tsdb: <tsdb> ]
  [ exemplars: <exemplars> ]

# Configures exporting traces.
tracing:
  [ <tracing_config> ]
```

### 2.`<scrape_config>`

一个 `scrape_config` 部分指定了一组目标和描述如何抓取它们的参数。通常情况下，***一个抓取配置指定一个作业***。在高级配置中，这可能会有所不同。

```yaml
# The job name assigned to scraped metrics by default.
job_name: <job_name>

# How frequently to scrape targets from this job.
[ scrape_interval: <duration> | default = <global_config.scrape_interval> ]

# Per-scrape timeout when scraping this job.
# It cannot be greater than the scrape interval.
[ scrape_timeout: <duration> | default = <global_config.scrape_timeout> ]

# The protocols to negotiate during a scrape with the client.
# Supported values (case sensitive): PrometheusProto, OpenMetricsText0.0.1,
# OpenMetricsText1.0.0, PrometheusText0.0.4, PrometheusText1.0.0.
[ scrape_protocols: [<string>, ...] | default = <global_config.scrape_protocols> ]

# Fallback protocol to use if a scrape returns blank, unparseable, or otherwise
# invalid Content-Type.
# Supported values (case sensitive): PrometheusProto, OpenMetricsText0.0.1,
# OpenMetricsText1.0.0, PrometheusText0.0.4, PrometheusText1.0.0.
[ fallback_scrape_protocol: <string> ]

# Whether to scrape a classic histogram, even if it is also exposed as a native
# histogram (has no effect without --enable-feature=native-histograms).
[ always_scrape_classic_histograms: <boolean> |
default = <global.always_scrape_classic_hisotgrams> ]

# The HTTP resource path on which to fetch metrics from targets.
[ metrics_path: <path> | default = /metrics ]

# honor_labels controls how Prometheus handles conflicts between labels that are
# already present in scraped data and labels that Prometheus would attach
# server-side ("job" and "instance" labels, manually configured target
# labels, and labels generated by service discovery implementations).
#
# If honor_labels is set to "true", label conflicts are resolved by keeping label
# values from the scraped data and ignoring the conflicting server-side labels.
#
# If honor_labels is set to "false", label conflicts are resolved by renaming
# conflicting labels in the scraped data to "exported_<original-label>" (for
# example "exported_instance", "exported_job") and then attaching server-side
# labels.
#
# Setting honor_labels to "true" is useful for use cases such as federation and
# scraping the Pushgateway, where all labels specified in the target should be
# preserved.
#
# Note that any globally configured "external_labels" are unaffected by this
# setting. In communication with external systems, they are always applied only
# when a time series does not have a given label yet and are ignored otherwise.
[ honor_labels: <boolean> | default = false ]

# honor_timestamps controls whether Prometheus respects the timestamps present
# in scraped data.
#
# If honor_timestamps is set to "true", the timestamps of the metrics exposed
# by the target will be used.
#
# If honor_timestamps is set to "false", the timestamps of the metrics exposed
# by the target will be ignored.
[ honor_timestamps: <boolean> | default = true ]

# track_timestamps_staleness controls whether Prometheus tracks staleness of
# the metrics that have an explicit timestamps present in scraped data.
#
# If track_timestamps_staleness is set to "true", a staleness marker will be
# inserted in the TSDB when a metric is no longer present or the target
# is down.
[ track_timestamps_staleness: <boolean> | default = false ]

# Configures the protocol scheme used for requests.
[ scheme: <scheme> | default = http ]

# Optional HTTP URL parameters.
params:
  [ <string>: [<string>, ...] ]

# If enable_compression is set to "false", Prometheus will request uncompressed
# response from the scraped target.
[ enable_compression: <boolean> | default = true ]

# File to which scrape failures are logged.
# Reloading the configuration will reopen the file.
[ scrape_failure_log_file: <string> ]

# HTTP client settings, including authentication methods (such as basic auth and
# authorization), proxy configurations, TLS options, custom HTTP headers, etc.
[ <http_config> ]

# List of Azure service discovery configurations.
azure_sd_configs:
  [ - <azure_sd_config> ... ]

# List of Consul service discovery configurations.
consul_sd_configs:
  [ - <consul_sd_config> ... ]

# List of DigitalOcean service discovery configurations.
digitalocean_sd_configs:
  [ - <digitalocean_sd_config> ... ]

# List of Docker service discovery configurations.
docker_sd_configs:
  [ - <docker_sd_config> ... ]

# List of Docker Swarm service discovery configurations.
dockerswarm_sd_configs:
  [ - <dockerswarm_sd_config> ... ]

# List of DNS service discovery configurations.
dns_sd_configs:
  [ - <dns_sd_config> ... ]

# List of EC2 service discovery configurations.
ec2_sd_configs:
  [ - <ec2_sd_config> ... ]

# List of Eureka service discovery configurations.
eureka_sd_configs:
  [ - <eureka_sd_config> ... ]

# List of file service discovery configurations.
file_sd_configs:
  [ - <file_sd_config> ... ]

# List of GCE service discovery configurations.
gce_sd_configs:
  [ - <gce_sd_config> ... ]

# List of Hetzner service discovery configurations.
hetzner_sd_configs:
  [ - <hetzner_sd_config> ... ]

# List of HTTP service discovery configurations.
http_sd_configs:
  [ - <http_sd_config> ... ]


# List of IONOS service discovery configurations.
ionos_sd_configs:
  [ - <ionos_sd_config> ... ]

# List of Kubernetes service discovery configurations.
kubernetes_sd_configs:
  [ - <kubernetes_sd_config> ... ]

# List of Kuma service discovery configurations.
kuma_sd_configs:
  [ - <kuma_sd_config> ... ]

# List of Lightsail service discovery configurations.
lightsail_sd_configs:
  [ - <lightsail_sd_config> ... ]

# List of Linode service discovery configurations.
linode_sd_configs:
  [ - <linode_sd_config> ... ]

# List of Marathon service discovery configurations.
marathon_sd_configs:
  [ - <marathon_sd_config> ... ]

# List of AirBnB's Nerve service discovery configurations.
nerve_sd_configs:
  [ - <nerve_sd_config> ... ]

# List of Nomad service discovery configurations.
nomad_sd_configs:
  [ - <nomad_sd_config> ... ]

# List of OpenStack service discovery configurations.
openstack_sd_configs:
  [ - <openstack_sd_config> ... ]

# List of OVHcloud service discovery configurations.
ovhcloud_sd_configs:
  [ - <ovhcloud_sd_config> ... ]

# List of PuppetDB service discovery configurations.
puppetdb_sd_configs:
  [ - <puppetdb_sd_config> ... ]

# List of Scaleway service discovery configurations.
scaleway_sd_configs:
  [ - <scaleway_sd_config> ... ]

# List of Zookeeper Serverset service discovery configurations.
serverset_sd_configs:
  [ - <serverset_sd_config> ... ]

# List of STACKIT service discovery configurations.
stackit_sd_configs:
  [ - <stackit_sd_config> ... ]

# List of Triton service discovery configurations.
triton_sd_configs:
  [ - <triton_sd_config> ... ]

# List of Uyuni service discovery configurations.
uyuni_sd_configs:
  [ - <uyuni_sd_config> ... ]

# List of labeled statically configured targets for this job.
static_configs:
  [ - <static_config> ... ]

# List of target relabel configurations.
relabel_configs:
  [ - <relabel_config> ... ]

# List of metric relabel configurations.
metric_relabel_configs:
  [ - <relabel_config> ... ]

# An uncompressed response body larger than this many bytes will cause the
# scrape to fail. 0 means no limit. Example: 100MB.
# This is an experimental feature, this behaviour could
# change or be removed in the future.
[ body_size_limit: <size> | default = 0 ]

# Per-scrape limit on the number of scraped samples that will be accepted.
# If more than this number of samples are present after metric relabeling
# the entire scrape will be treated as failed. 0 means no limit.
[ sample_limit: <int> | default = 0 ]

# Limit on the number of labels that will be accepted per sample. If more
# than this number of labels are present on any sample post metric-relabeling,
# the entire scrape will be treated as failed. 0 means no limit.
[ label_limit: <int> | default = 0 ]

# Limit on the length (in bytes) of each individual label name. If any label
# name in a scrape is longer than this number post metric-relabeling, the
# entire scrape will be treated as failed. Note that label names are UTF-8
# encoded, and characters can take up to 4 bytes. 0 means no limit.
[ label_name_length_limit: <int> | default = 0 ]

# Limit on the length (in bytes) of each individual label value. If any label
# value in a scrape is longer than this number post metric-relabeling, the
# entire scrape will be treated as failed. Note that label values are UTF-8
# encoded, and characters can take up to 4 bytes. 0 means no limit.
[ label_value_length_limit: <int> | default = 0 ]

# Limit per scrape config on number of unique targets that will be
# accepted. If more than this number of targets are present after target
# relabeling, Prometheus will mark the targets as failed without scraping them.
# 0 means no limit. This is an experimental feature, this behaviour could
# change in the future.
[ target_limit: <int> | default = 0 ]

# Limit per scrape config on the number of targets dropped by relabeling
# that will be kept in memory. 0 means no limit.
[ keep_dropped_targets: <int> | default = 0 ]

# Specifies the validation scheme for metric and label names. Either blank or
# "utf8" for full UTF-8 support, or "legacy" for letters, numbers, colons, and
# underscores.
[ metric_name_validation_scheme: <string> | default "utf8" ]

# Specifies the character escaping scheme that will be requested when scraping
# for metric and label names that do not conform to the legacy Prometheus
# character set. Available options are:
#   * `allow-utf-8`: Full UTF-8 support, no escaping needed.
#   * `underscores`: Escape all legacy-invalid characters to underscores.
#   * `dots`: Escapes dots to `_dot_`, underscores to `__`, and all other
#     legacy-invalid characters to underscores.
#   * `values`: Prepend the name with `U__` and replace all invalid
#     characters with their unicode value, surrounded by underscores. Single
#     underscores are replaced with double underscores.
#     e.g. "U__my_2e_dotted_2e_name".
# If this value is left blank, Prometheus will default to `allow-utf-8` if the
# validation scheme for the current scrape config is set to utf8, or
# `underscores` if the validation scheme is set to `legacy`.
[ metric_name_escaping_scheme: <string> | default "allow-utf-8" ]

# Limit on total number of positive and negative buckets allowed in a single
# native histogram. The resolution of a histogram with more buckets will be
# reduced until the number of buckets is within the limit. If the limit cannot
# be reached, the scrape will fail.
# 0 means no limit.
[ native_histogram_bucket_limit: <int> | default = 0 ]

# Lower limit for the growth factor of one bucket to the next in each native
# histogram. The resolution of a histogram with a lower growth factor will be
# reduced as much as possible until it is within the limit.
# To set an upper limit for the schema (equivalent to "scale" in OTel's
# exponential histograms), use the following factor limits:
#
# +----------------------------+----------------------------+
# |        growth factor       | resulting schema AKA scale |
# +----------------------------+----------------------------+
# |          65536             |             -4             |
# +----------------------------+----------------------------+
# |            256             |             -3             |
# +----------------------------+----------------------------+
# |             16             |             -2             |
# +----------------------------+----------------------------+
# |              4             |             -1             |
# +----------------------------+----------------------------+
# |              2             |              0             |
# +----------------------------+----------------------------+
# |              1.4           |              1             |
# +----------------------------+----------------------------+
# |              1.1           |              2             |
# +----------------------------+----------------------------+
# |              1.09          |              3             |
# +----------------------------+----------------------------+
# |              1.04          |              4             |
# +----------------------------+----------------------------+
# |              1.02          |              5             |
# +----------------------------+----------------------------+
# |              1.01          |              6             |
# +----------------------------+----------------------------+
# |              1.005         |              7             |
# +----------------------------+----------------------------+
# |              1.002         |              8             |
# +----------------------------+----------------------------+
#
# 0 results in the smallest supported factor (which is currently ~1.0027 or
# schema 8, but might change in the future).
[ native_histogram_min_bucket_factor: <float> | default = 0 ]

# Specifies whether to convert classic histograms into native histograms with
# custom buckets (has no effect without --enable-feature=native-histograms).
[ convert_classic_histograms_to_nhcb: <bool> | default =
<global.convert_classic_histograms_to_nhcb>]
```



## 三、Exporter和PushGateway

### 1. Exporter
Exporter 是一个独立的小程序，运行在被监控的主机或服务旁边。它负责采集本机或服务的运行状态指标，并通过 HTTP /metrics 接口暴露出来，然后 Prometheus Server 会定期去拉取这些数据。换句话说，Exporter 是 Prometheus 的“数据探针”，没有 Exporter，Prometheus 本身不会主动产生指标数据。使用 Exporter 的通用步骤，Node Exporter 为例（它用来监控主机 CPU、内存、磁盘、网络等）：

```yaml
① 下载并运行 Exporter
# 下载 node_exporter（以Linux为例）
wget https://github.com/prometheus/node_exporter/releases/download/v1.8.2/node_exporter-1.8.2.linux-amd64.tar.gz
tar xvf node_exporter-1.8.2.linux-amd64.tar.gz
cd node_exporter-1.8.2.linux-amd64

# 启动
./node_exporter
```

默认会在 :9100 端口提供 /metrics 接口，在 Prometheus 配置中添加 Scrape Job，编辑 prometheus.yml：
```yaml
scrape_configs:
  - job_name: 'node_exporter' #job_name：任务名称，随便起，便于识别
    static_configs:
      - targets: ['192.168.1.100:9100'] #targets：Exporter 所在主机和端口
```

🧰 常见类型的 Exporters
|Exporter名称|	用途 |
|---|---|
|Node Exporter	| 监控主机 CPU、内存、磁盘、网络等系统指标|
|Blackbox Exporter	| 通过 ping/HTTP/TCP 等方式探测外部服务是否可达|
|MySQL Exporter	| 监控 MySQL 数据库性能指标|
|Redis Exporter	| 监控 Redis 运行状态|
|Kafka Exporter	| 监控 Apache Kafka 消息队列集群指标|
|Pushgateway	| 接收短命任务推送的临时指标（不是自动采集）|

📝 小结
Exporter 就像“传感器”，Prometheus 定期拉取它们的数据。
使用流程固定：部署 → 暴露 /metrics → 配置 prometheus.yml → 重启 → 可视化。

### 2. Pushgateway
Prometheus在正常情况下通过Pull模式从产生metric或者expoter当中拉取监控数据。但如果监控Flink或者Yarn作业让Prometheu自动发现作业的提交、结束和自动拉取数据就显得比较困难。Pushgateway是一个中转组件，通过相关的配置可以将metric推送到PushGateway，Prometheus再从中自动拉取即可。

Pushgateway 的工作原理

- 这些任务可以**在完成时将指标数据推送(push)到 Pushgateway**。
- Pushgateway 会**临时存储**这些指标，并提供一个 **/metrics HTTP 接口**。
- Prometheus **定期从 Pushgateway 拉取**这些数据。

📌 所以 Pushgateway **充当一个中转缓存**，把“主动推送”转换成“可被拉取”。需要注意的是Pushgateway 不产生指标，只存储你推送来的数据。

⚙️ 架构流程图
```yaml
[短命任务脚本] --push--> [Pushgateway] <--scrape-- [Prometheus] --> [Grafana]
```

应用实例

docker-compose.yml 添加 Pushgateway。在docker-compose.yml 中加上：
```yaml
  pushgateway:
    image: prom/pushgateway:latest
    container_name: pushgateway
    ports:
      - "9091:9091"
```

在prometheus.yml 添加配置
```yaml
scrape_configs:
  - job_name: 'pushgateway'
    static_configs:
      - targets: ['pushgateway:9091']
```

这样 Prometheus 就会定期拉取 Pushgateway 中存储的指标。

⚡ 推送示例（手动 curl）
模拟一个短命脚本推送数据：
```bash
echo "build_status 1" \  #build_status 是指标名称 1 是指标值
  | curl --data-binary @- http://localhost:9091/metrics/job/my_build 
  #job=my_build 是这个任务的名字
```
推送完成后，访问：http://localhost:9091/
 可以看到你推送的数据。

