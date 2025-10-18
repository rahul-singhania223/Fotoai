import runpodSdk from "runpod-sdk";

const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!;
const ENDPOINT_ID = process.env.RUNPOD_ENDPOINT_ID!;

const runpod = runpodSdk(RUNPOD_API_KEY);
const endpoint = runpod.endpoint(ENDPOINT_ID);

export default endpoint;
