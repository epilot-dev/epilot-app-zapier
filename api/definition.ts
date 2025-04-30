import { Document } from "openapi-backend";
import oas from "./openapi.json";

const definition = oas as unknown as Document;

export { definition };
