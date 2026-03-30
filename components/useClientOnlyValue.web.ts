// useClientOnlyValue.web.ts - Web 专用版本
// 在 Web 构建时直接使用客户端值，避免 SSR 问题
export function useClientOnlyValue<S, C>(_server: S, client: C): C {
  return client;
}
