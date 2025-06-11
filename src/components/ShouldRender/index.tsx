import { ShouldRenderProps } from "./interface";


export const ShouldRender = ({ condition, elseRender, children }: ShouldRenderProps) =>
  condition ? children : elseRender ?? null;
