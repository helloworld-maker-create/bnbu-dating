产品需求文档 (PRD v2.0) - Dating In BNBU
Vibe Coding 专用版架构说明
1. 产品定位与护城河 (Product Vision)
●产品定位：一款专为高校学生打造的全生命周期校园社交与校友网络。不仅解决陌生人破冰（Dating），更注重基于学术背景、申研目标和职场方向的深度连接（论坛与校友圈） 。
●目标用户：高度关注学业、申研、职场发展的高校在校生及校友。
●核心护城河 (团队 AI 优势)：
○Chemistry 匹配算法：摒弃纯看脸匹配，基于专业 (Major)、GPA 追求、申研目标 (Grad School Goal) 进行高维匹配 。
○AI 破冰助手 (Icebreaker)：利用大模型根据双方资料自动生成学术/兴趣相关的破冰话题。
○严格校园认证：建立高质量的纯粹校园/校友生态。
2. Vibe Coding 技术与视觉规范 (Cursor Strict Rules)
请团队所有成员在向 Cursor 下达 Prompt 时，默认遵循以下规范：
●视觉风格 (UI/UX)：
○色彩体系：极简奶油风（Cream Base #FAF7F2） + 深棕色强调（Deep Brown #7A5C4F）。
○字体：标题使用 Serif（衬线体，营造学术高冷感），正文使用 Sans-serif（无衬线体，保证易读性）。
○组件要求：大圆角、轻阴影、卡片式布局，避免复杂的层级嵌套。
●技术栈锁定 (Tech Stack)（更新原 PRD 的复杂后端架构 ）：
○前端：React Native (配合 Expo) 或 Flutter（AI 生成准确率最高）。
○后端/数据库：Supabase 或 Firebase (BaaS)。禁止从零手写后端接口，直接通过前端调用 BaaS 的 SDK 进行增删改查和实时通讯 。
3. 核心数据字典 (Single Source of Truth)
这是建表的唯一标准，Cursor 生成代码必须依据此结构：
●users (用户信息表)：id, real_name, avatar_url, major (专业), career_direction (职场方向), academic_tags (学术/兴趣标签数组), is_verified (校园认证状态)。
●swipes (匹配记录表)：swiper_id, swiped_id, action ('left', 'right', 'super_like' ), chemistry_score (AI 匹配度)。
●matches (成功匹配表)：user1_id, user2_id, created_at。
●posts (论坛帖子表)：id, author_id, category ('学业疑难', '求助互助', '二手市场', '表白墙' ), content, is_anonymous (匿名状态 ), upvotes。
4. MVP 1.0 功能模块拆解 (供团队认领)
模块 A：Dating & 智能连接 (前端组 + AI组主攻)
1.高维资料卡片 (Profile)：
○全屏沉浸式照片展示 。
○核心信息外显：姓名、专业、职业方向紧贴头像下方展示。
○标签化展示兴趣与学术背景 。
2.滑动交互核心 (Swipe Engine)：
○丝滑的左右滑动卡片动画 。
○Chemistry 显化：卡片显著位置展示基于双方资料计算出的 chemistry_score (如 "82% Match") 。
3.智能消息页 (Smart Chat)：
○顶部展示 Match 头像列表。
○聊天对话框集成 AI Icebreaker 提示按钮，一键生成破冰开场白。
○基础图文聊天功能 。
模块 B：校园生命周期论坛 (后端组 + 前端组主攻)
1.极简分类信息流 (Feeds)：
○取消复杂的板块，采用顶部 Tab 切换：学术/申研、组队/求助、闲置转让、匿名树洞 。
2.轻量发布器 (Quick Post)：
○悬浮 '+' 号一键唤起。
○支持切换“实名”与“匿名树洞”身份 。
3.互动与通知：
○点赞 (Upvote)、评论功能 。
○统一的通知中心（集合 Match 通知、帖子互动通知） 。
模块 C：基建与安全 (架构总控)
1.校园认证墙：强制 edu 邮箱或学生证审核后才可使用 Dating 功能。
2.极简安全中心：聊天与主页均设有一键举报/拉黑入口 。

建议：
你可以在 Cursor 项目的根目录下建一个名为 project_context.md 的文件，把上面的内容全部复制进去。
团队里的任何人，在让 Cursor 写某个页面的代码之前，只需要加一句提示词：
"请先阅读 project_context.md 了解全局设计规范和数据表结构，然后帮我编写 [具体页面名称] 的代码..."
保证 8 个人写出来的代码，风格是统一的，底层逻辑是能对得上的！


