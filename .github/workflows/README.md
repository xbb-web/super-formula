# GitHub Actions 自动发布配置

## npm-publish.yml

这个workflow会在你推送新的版本tag时自动发布包到npm。

## ⚠️ npm 安全政策更新（2025年11月）

根据 [npm 最新安全政策](https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/)：

- ❌ **经典令牌（Classic Tokens）已被弃用**，不再可用
- ⚠️ **细粒度令牌（Granular Access Tokens）有效期限制**：最长90天
- ⭐ **推荐使用 Trusted Publishers（可信发布者）**：无需手动管理令牌

## 配置方式（二选一）

### 🌟 方式一：Trusted Publishers（推荐）

**优点：**
- ✅ 无需管理令牌，完全自动化
- ✅ 更安全，令牌不会泄露
- ✅ 自动添加 provenance（来源证明）
- ✅ 无需定期更新令牌

**配置步骤：**

1. **在 npm 上配置 Trusted Publishers**
   - 登录 [npmjs.com](https://www.npmjs.com/)
   - 进入你的包页面，点击 Settings
   - 找到 "Publishing Access" → "Trusted Publishers"
   - 点击 "Add Trusted Publisher"
   - 选择 "GitHub Actions"
   - 填写信息：
     - Organization/Username: `xbb-web`
     - Repository: `super-formula`
     - Workflow: `npm-publish.yml`
     - Environment: 留空（除非你使用了 GitHub Environments）

2. **修改 workflow 文件**
   - 打开 `.github/workflows/npm-publish.yml`
   - 取消注释"方法1"的代码
   - 删除或注释掉"方法2"的代码

完成！之后推送 tag 就会自动发布，无需任何令牌。

---

### 🔑 方式二：使用细粒度访问令牌

**注意：** 令牌最长有效期90天，需要定期更新！

**配置步骤：**

#### 1. 获取 NPM Granular Access Token

1. 登录到 [npmjs.com](https://www.npmjs.com/)
2. 点击右上角头像 → Access Tokens
3. 点击 "Generate New Token" → "Granular Access Token"
4. 配置令牌：
   - **Expiration**: 选择有效期（最长90天）
   - **Packages and scopes**: 选择你要发布的包
   - **Permissions**: 选择 "Read and write"
5. 复制生成的 token（⚠️ 只会显示一次！）

#### 2. 在 GitHub 中配置 Secret

1. 打开你的 GitHub 仓库页面
2. 进入 Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. Name 填写: `NPM_TOKEN`
5. Value 填写: 粘贴你刚才复制的 npm token
6. 点击 "Add secret"

#### 3. 设置令牌过期提醒

⚠️ **重要**：令牌会在最多90天后过期，记得：
- 在日历中设置提醒
- 或者在 npm 上设置较短的有效期（如30天）并定期更新

### 3. 发布新版本

每次需要发布新版本时，按照以下步骤操作：

```bash
# 1. 更新 package.json 中的版本号
npm version patch  # 小版本更新 (1.5.2 -> 1.5.3)
# 或
npm version minor  # 中版本更新 (1.5.2 -> 1.6.0)
# 或
npm version major  # 大版本更新 (1.5.2 -> 2.0.0)

# 2. 推送代码和 tag 到 GitHub
git push && git push --tags
```

推送 tag 后，GitHub Actions 会自动：
- 检出代码
- 安装依赖
- 运行测试
- 构建项目
- 发布到 npm

### 4. 查看发布状态

1. 进入 GitHub 仓库的 Actions 标签页
2. 查看 "发布到 NPM" workflow 的运行状态
3. 如果失败，点击进入查看详细日志

## 触发条件

- **自动触发**: 当推送以 `v` 开头的 tag 时（如 v1.5.3, v2.0.0）
- **不会触发**: 普通的代码推送不会触发发布流程

## 安全说明

### Trusted Publishers 方式：
- ✅ 零令牌管理，使用短期的 OIDC 临时凭证
- ✅ 自动 provenance 认证，提供完整的供应链透明度
- ✅ 防止令牌泄露风险

### 令牌方式：
- NPM_TOKEN 存储在 GitHub Secrets 中，是加密的，只有在 workflow 运行时才能访问
- ⚠️ 令牌最长有效期90天，需要定期轮换
- 使用细粒度令牌而非经典令牌，权限更精确

### 通用安全措施：
- 使用 `--provenance` 参数发布，会在 npm 上显示包的来源信息，增加可信度
- workflow 使用 `npm ci` 而不是 `npm install`，确保使用 package-lock.json 中的精确版本
- 发布前自动运行测试，确保代码质量

## 故障排查

### 发布失败常见原因

#### 使用 Trusted Publishers 时：

1. **OIDC authentication failed**: 
   - 检查 npm 上的 Trusted Publisher 配置是否正确
   - 确认 Organization/Repository/Workflow 名称完全匹配
   - 确保 workflow 中有 `id-token: write` 权限

2. **403 Forbidden**: 
   - 确保你是包的 owner 或 maintainer
   - 检查 Trusted Publisher 是否已正确激活

#### 使用令牌时：

1. **401 Unauthorized**: NPM_TOKEN 无效或过期
   - ⚠️ 令牌可能已过期（最长90天）
   - 解决方法: 重新生成细粒度令牌并更新 GitHub Secret

2. **403 Forbidden**: 没有权限发布包
   - 检查令牌的权限范围是否包含该包
   - 确保令牌有 "Read and write" 权限

#### 通用问题：

3. **版本号已存在**: 该版本已经发布过
   - 解决方法: 更新 package.json 中的版本号

4. **测试失败**: 测试未通过
   - 解决方法: 在本地运行 `npm test` 修复测试问题

5. **构建失败**: 构建过程出错
   - 解决方法: 在本地运行 `npm run build` 检查构建问题

## 🔗 相关资源

- [npm 安全更新公告](https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/)
- [npm Trusted Publishers 文档](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions OIDC 文档](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

