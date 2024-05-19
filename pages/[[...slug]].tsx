import PageComposition from "@/components/PageComposition";
import { withUniformGetServerSideProps } from "@uniformdev/canvas-next/route";
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  ComponentInstance,
  walkNodeTree,
} from "@uniformdev/canvas";
import { getPattern } from "@/lib/uniform/canvasClient";

export const getServerSideProps = withUniformGetServerSideProps({
  requestOptions: {
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  },
  handleComposition: async (
    { compositionApiResponse },
    { preview },
    _defaultHandler
  ) => {
    const { composition } = compositionApiResponse || {};
    // get all mboxes from the composition
    const mboxes: string[] = [];
    walkNodeTree(composition, (node) => {
      if (node.type === "component" && node.node.type === "targetContainer") {
        const mbox = node.node.parameters?.mbox?.value as string;
        if (mbox) {
          mboxes.push(mbox);
        }
      }
    });

    const decisions = await Promise.all(
      mboxes.map(async (mbox) => {
        const resp = await fetch(
          `http://localhost:3000/api/target?mbox=${mbox}`
        );
        const decisionData = await resp.json();

        const patternData = await getPattern(decisionData?.patternId, preview);
        return { mbox: mbox, data: patternData };
      })
    );

    walkNodeTree(composition, ({ node: component, actions }) => {
      if (component.type === "targetContainer") {
        // @ts-ignore
        const mbox = component.parameters?.mbox?.value as string;
        if (mbox) {
          const decision = decisions.find((d) => d.mbox === mbox);
          const newComponent: ComponentInstance = decision.data;
          // @ts-ignore
          actions.replace(newComponent);
        }
      }
    });

    return {
      props: {
        data: composition,
      },
    };
  },
});

export default PageComposition;
