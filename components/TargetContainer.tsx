import {
  registerUniformComponent,
  ComponentProps,
  useUniformContextualEditingState,
} from "@uniformdev/canvas-react";

type TargetContainerProps = ComponentProps<{
  mbox: string;
}>;

const TargetContainer: React.FC<TargetContainerProps> = () => {
  const { previewMode } = useUniformContextualEditingState();
  const isContextualEditing = previewMode === "editor";

  return isContextualEditing ? (
    <h1>Adobe Target decision will be rendered here</h1>
  ) : null;
};

registerUniformComponent({
  type: "targetContainer",
  component: TargetContainer,
});

export default TargetContainer;
