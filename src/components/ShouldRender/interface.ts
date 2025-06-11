export interface ShouldRenderProps {
  condition: boolean;
  children: JSX.Element | JSX.Element[];
  elseRender?: JSX.Element | JSX.Element[];
}