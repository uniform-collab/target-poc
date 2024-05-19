import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  patternId?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { mbox } = req.query;
  if (mbox && Object.keys(mockTargetResponseData).includes(mbox as string)) {
    const patternId = mockTargetResponseData[mbox as string];
    res.status(200).json({ patternId });
    return;
  }
  res.status(404).json({});
}

const mockTargetResponseData = {
  abc: "c0ebea4c-2e09-4202-b8b3-38b65b3810c3",
  xyz: "cb0aa454-36eb-4e42-af8e-3f01c006ed90",
};
