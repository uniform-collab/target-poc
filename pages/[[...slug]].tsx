import PageComposition from "@/components/PageComposition";
import { withUniformGetServerSideProps } from "@uniformdev/canvas-next/route";
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  ComponentInstance,
  walkNodeTree,
} from "@uniformdev/canvas";
import {
  getCompositionsForNavigation,
  getPattern,
} from "@/lib/uniform/canvasClient";

// IMPORTANT: this starter is using SSR mode by default for simplicity. SSG mode can be enabled, please check Uniform docs here: https://docs.uniform.app/docs/guides/composition/routing#project-map-with-uniform-get-server-side-props-and-with-uniform-get-static-props
export const getServerSideProps = withUniformGetServerSideProps({
  // fetching draft composition in dev mode for convenience
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

    console.log({ mboxes });

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

    // console.log(JSON.stringify(decisions, null, 2));

    walkNodeTree(composition, (node) => {
      if (node.type === "component" && node.node.type === "targetContainer") {
        const mbox = node.node.parameters?.mbox?.value as string;
        if (mbox) {
          const decision = decisions.find((d) => d.mbox === mbox);
          console.log({ patternToInject: decision.data });
        }
      }
    });

    //console.log(JSON.stringify(composition, null, 2));

    return {
      props: {
        data: composition,
      },
    };
  },
});

export default PageComposition;
