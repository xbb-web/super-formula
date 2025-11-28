# 迁移到 Trusted Publishers 指南

## 为什么要迁移？

根据 [npm 最新安全政策](https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/)，npm 正在加强安全性：

- ❌ 经典令牌（Classic Tokens）已被废弃
- ⚠️ 细粒度令牌最长有效期仅90天，需要频繁更新
- ⭐ **Trusted Publishers 是推荐的最佳实践**

## Trusted Publishers 的优势

### 🔒 安全性
- **无长期令牌**：使用 OIDC 临时凭证，有效期仅几分钟
- **零泄露风险**：没有令牌需要存储或管理
- **自动 Provenance**：提供完整的供应链透明度

### 🚀 便利性
- **零维护**：无需担心令牌过期
- **自动化**：配置一次，永久使用
- **无需 Secrets**：不需要在 GitHub 中配置任何密钥

### 📊 可追溯性
- 每个包发布都自动包含来源证明
- 可以追溯到具体的 commit 和 workflow
- 增强用户对包的信任

## 迁移步骤

### 第一步：在 npm 上配置 Trusted Publishers

1. **登录 npm**
   - 访问 [npmjs.com](https://www.npmjs.com/)
   - 登录你的账号

2. **进入包设置**
   - 找到包 `super-form-formula`
   - 点击包页面的 Settings 标签

3. **添加 Trusted Publisher**
   - 找到 "Publishing Access" 部分
   - 点击 "Trusted Publishers"
   - 点击 "Add Trusted Publisher"

4. **配置 GitHub Actions**
   - Provider: 选择 **GitHub Actions**
   - Organization/Username: `xbb-web`
   - Repository: `super-formula`
   - Workflow filename: `npm-publish.yml`
   - Environment: 留空（除非你使用 GitHub Environments）

5. **保存配置**
   - 点击 "Add" 或 "Save"
   - 你会看到新添加的 Trusted Publisher 配置

### 第二步：更新 workflow 文件

打开 `.github/workflows/npm-publish.yml`，进行以下修改：

**修改前：**
```yaml
      # 方法1: 使用 Trusted Publishers (推荐，无需令牌)
      # 如果在 npm 上配置了 Trusted Publishers，取消下面的注释并删除方法2
      # - name: 发布到 NPM (Trusted Publishers)
      #   run: npm publish --provenance --access public
      
      # 方法2: 使用细粒度访问令牌 (Granular Access Token)
      # 注意：令牌最长有效期90天，需要定期更新
      - name: 发布到 NPM (使用令牌)
        run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**修改后：**
```yaml
      # 使用 Trusted Publishers (已配置)
      - name: 发布到 NPM
        run: npm publish --provenance --access public
```

### 第三步：测试发布

1. **创建测试 tag**
   ```bash
   # 假设当前版本是 1.5.2，创建一个补丁版本
   npm version patch
   # 这会创建 v1.5.3 的 tag
   ```

2. **推送 tag**
   ```bash
   git push && git push --tags
   ```

3. **查看 Actions**
   - 访问 GitHub 仓库的 Actions 标签页
   - 查看 "发布到 NPM" workflow 的运行状态
   - 确认发布成功

4. **验证 npm 包**
   - 访问 [npmjs.com/package/super-form-formula](https://www.npmjs.com/package/super-form-formula)
   - 确认新版本已发布
   - 查看 Provenance 信息

### 第四步：清理（可选）

迁移成功后，你可以：

1. **删除 GitHub Secret**
   - 进入仓库 Settings → Secrets and variables → Actions
   - 删除 `NPM_TOKEN` secret（可选，但推荐）

2. **撤销 npm 令牌**
   - 登录 npm
   - 进入 Access Tokens
   - 找到之前用于 CI/CD 的令牌
   - 点击 "Revoke" 撤销

## 故障排查

### ❌ OIDC token authentication failed

**原因：** npm 上的 Trusted Publisher 配置不正确

**解决方法：**
1. 检查 npm 上的配置，确保：
   - Organization/Username 是 `xbb-web`（不是你的个人用户名）
   - Repository 是 `super-formula`
   - Workflow 是 `npm-publish.yml`（精确匹配）
2. 确保 workflow 文件中有 `id-token: write` 权限

### ❌ 403 Forbidden

**原因：** 权限问题

**解决方法：**
1. 确认你是包的 owner 或 maintainer
2. 检查 Trusted Publisher 是否已保存并激活

### ❌ Package not found

**原因：** 包名不匹配

**解决方法：**
1. 确认 `package.json` 中的 `name` 字段是 `super-form-formula`
2. 确认这个包已经存在于 npm 上

## 常见问题

### Q: 可以同时使用令牌和 Trusted Publishers 吗？

A: 可以。配置 Trusted Publishers 后，令牌方式仍然可用作为备份方案。

### Q: 如果我有多个仓库发布同一个包怎么办？

A: 你可以为同一个包配置多个 Trusted Publishers，每个仓库配置一个。

### Q: Trusted Publishers 支持哪些 CI/CD 平台？

A: 目前 npm 支持：
- ✅ GitHub Actions
- ✅ GitLab CI/CD
- 🔄 Azure Pipelines（即将支持）
- 🔄 CircleCI（即将支持）

### Q: 迁移后还需要担心令牌过期吗？

A: 不需要！Trusted Publishers 使用短期 OIDC 令牌，完全自动化，无需任何维护。

### Q: 如何验证 Provenance？

A: 发布后，访问 npm 包页面，你会看到一个 "Provenance" 徽章，点击可以查看详细的供应链信息。

## 推荐时间表

- **立即行动**：如果你当前使用经典令牌（已被废弃）
- **尽快迁移**：如果你使用细粒度令牌但想减少维护负担
- **测试环境优先**：先在测试项目上验证 Trusted Publishers

## 需要帮助？

- 📚 [npm Trusted Publishers 文档](https://docs.npmjs.com/generating-provenance-statements)
- 📚 [GitHub OIDC 文档](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- 💬 [npm 社区讨论](https://github.com/npm/feedback)

---

**记住**：Trusted Publishers 不仅更安全，还更简单！ 🎉

