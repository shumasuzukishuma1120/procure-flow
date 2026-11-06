import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode, ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

type RenderWithQueryClientOptions = Omit<RenderOptions, "wrapper"> & {
  queryClient?: QueryClient;
};

export function renderWithQueryClient(
  ui: ReactElement,
  { queryClient = createTestQueryClient(), ...renderOptions }: RenderWithQueryClientOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return {
    queryClient,
    ...render(ui, {
      ...renderOptions,
      wrapper: Wrapper,
    }),
  };
}
