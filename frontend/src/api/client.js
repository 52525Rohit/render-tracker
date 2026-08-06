import axios from "axios";
import { API_END_POINT } from "../utils/context";

export const api = axios.create({ baseURL: API_END_POINT });
