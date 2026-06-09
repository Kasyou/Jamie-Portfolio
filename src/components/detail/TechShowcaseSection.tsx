import type { Project } from '../../types/project';

interface ShowcaseItem {
  title: string;
  text: string;
  image: string;
  imageRight?: boolean;
}

interface Props { project: Project; }

// Per-project showcase data — add entries here for other projects as needed
const showcaseData: Record<string, ShowcaseItem[]> = {
  'weather-report': [
    {
      title: 'OkHttp + Retrofit 网络层',
      text: '基于 OkHttp 和 Retrofit 构建的 RESTful API 网络层，完整封装了和风天气 API 的 4 个端点（城市搜索、实时天气、7 日预报、生活指数）。\n\nOkHttp 作为底层 HTTP 引擎，提供连接池复用机制减少 TCP 握手开销，支持最多 5 个并发连接、每个连接存活 5 分钟。拦截器链分为应用拦截器和网络拦截器两层：应用层添加 API Key 认证头和 User-Agent 标识，网络层统一处理重定向和重试逻辑，并通过日志拦截器输出请求耗时、响应码和 Body 大小用于调试。缓存策略采用 LRU 磁盘缓存（10MB），对天气数据设置 30 分钟 Cache-Control 过期时间，避免重复请求消耗 API 配额。\n\nRetrofit 通过 @GET、@Query 等注解将 HTTP 接口声明为 Java 方法，结合 Gson 自动完成 JSON 反序列化。RxJava 2 的 Scheduler 切换确保网络 I/O 在 io 线程池执行，结果通过 observeOn(AndroidSchedulers.mainThread()) 安全回到主线程更新 LiveData。NetworkApi 工厂类按 ApiType 枚举（城市搜索 vs 天气数据）缓存不同 base URL 的 Retrofit 单例，避免重复创建。统一超时配置（连接 10s、读取 20s、写入 15s）经过实际网络环境调优，弱网场景下通过 retryWhen 操作符实现指数退避重试（最多 3 次，间隔 1s/2s/4s）。',
      image: '/screenshots/weather-report/okhttp的测试展示.jpg',
      imageRight: true,
    },
    {
      title: 'MVVM 架构设计',
      text: '采用 Google 推荐的 MVVM 架构，严格分为 View → ViewModel → Repository → Data 四层，各层单向依赖，仅通过接口通信。\n\nView 层由 3 个 Activity 组成，全部使用 ViewBinding 替代 findViewById，编译期绑定视图消除空指针。所有 Activity 继承自 Library 模块的 NetworkActivity 抽象类，强制拆分 UI 初始化与 LiveData 观察逻辑。\n\nViewModel 层通过 MutableLiveData 暴露状态，不持有 View 引用，配置变更时自动存活。Repository 层封装数据来源决策：优先 Room 缓存（15 分钟有效期），未命中则通过 Retrofit 网络获取并回写。Data 层包含 Room（支持 Migration）、Retrofit 和 MMKV（mmap 机制比 SharedPreferences 快 100 倍）。\n\nLibrary 模块提炼了可复用的架构基类：BaseActivity → BaseVBActivity → NetworkActivity 逐层增强，BaseViewModel 统一错误处理。新 Activity 只需关注业务逻辑，样板代码几乎为零。',
      image: '/screenshots/weather-report/MVVM架构图.jpg',
      imageRight: false,
    },
  ],
};

export default function TechShowcaseSection({ project }: Props) {
  const showcases = showcaseData[project.id];
  if (!showcases || showcases.length === 0) return null;

  return (
    <section className="py-24 px-8 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-12">技术深挖</p>

        <div className="space-y-20">
          {showcases.map((item, i) => {
            const isRight = item.imageRight;
            return (
              <div key={i} className={`flex flex-col ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'} gap-14 items-start`}>
                {/* Text side */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">{item.title}</h3>
                  <p className="text-text-secondary text-[15px] leading-relaxed whitespace-pre-line">{item.text}</p>
                </div>

                {/* Image side */}
                <div className="flex-shrink-0 w-full md:w-[420px] rounded-xl bg-surface border border-border overflow-hidden" style={{ boxShadow: '0 0 50px rgba(88,166,255,0.06)' }}>
                  <img src={item.image} alt={item.title} className="w-full h-auto object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
