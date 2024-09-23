import { Express, Response, json } from "express";

import { Storage } from "../types/storage.js";
import { replacer, reviver } from "../utils/json.js";
import { FilterEventsReturn } from "./return-types.js";
import { ObjectFilter, passesObjectFilter } from "./filter.js";

function malformedRequest(res: Response, error: string): void {
  res.statusCode = 400;
  res.end(error);
}

export function registerRoutes(app: Express, storage: Storage) {
  const basePath = "/indexer/";
  app.use(json());

  // Get all events that pass a certain filter
  app.get(basePath + "filterEvents", async function (req, res) {
    try {
      if (!req.query.filter || typeof req.query.filter !== "string") {
        return malformedRequest(res, "Invalid filter");
      }
      const filter: ObjectFilter = JSON.parse(req.query.filter, reviver);

      const events = await storage.pluginSetupProcessorEvents.get();
      const filterEvents = Object.values(events)
        .map((e) => Object.values(e))
        .flat(1)
        .map((e) => Object.values(e))
        .flat(1)
        .filter((e) => {
          return passesObjectFilter(e, filter);
        });

      res.end(JSON.stringify(filterEvents as FilterEventsReturn, replacer));
    } catch (error: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error?.message ?? "Unknown error" }));
    }
  });
}
