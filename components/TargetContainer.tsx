import { RichTextParamValue } from "@uniformdev/canvas";
import { UniformRichText } from "@uniformdev/canvas-next";
import {
  registerUniformComponent,
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-react";

type TargetContainerProps = ComponentProps<{
  mbox: string;
}>;

const TargetContainer: React.FC<TargetContainerProps> = () => {
  return null;
};

registerUniformComponent({
  type: "targetContainer",
  component: TargetContainer,
});

export default TargetContainer;
