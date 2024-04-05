import express, { Request, Response } from "express";
import { checkToken } from "../utils/tokens";
import { apiRequest } from "../utils/fetchFunction";

const router = express.Router();
const mapBoxUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const mapboxToken = process.env.MAPBOX_TOKEN;

router.get("/mapbox/coordinates/", async (req: Request, res: Response) => {
  if (req.header("token") && checkToken(req.header("token"))) {
    const { address } = req.query;

    const response: Record<string, any> = await apiRequest(
      `${mapBoxUrl}/${address}.json?access_token=${mapboxToken}`
    );

    if (!response || !response.features[0] || !response.features[0].geometry) {
      return res.status(400).send({ error: "no coordinates found" });
    }

    const { geometry } = response.features[0];

    return res.status(200).json({
      coordinates: {
        lat: geometry.coordinates[1],
        lng: geometry.coordinates[0],
      },
    });
  } else return res.status(401).send({ error: "unauthorized" });
});

router.get("/mapbox/address/", async (req: Request, res: Response) => {
  if (req.header("token") && checkToken(req.header("token"))) {
    const { lat, lng } = req.query;
    const response: Record<string, any> = await apiRequest(
      `${mapBoxUrl}/${lng},${lat}.json?access_token=${mapboxToken}`
    );

    if (!response || !response.features) {
      return res.status(400).send({ error: "no address found" });
    }
    const { features } = response;

    return res.status(200).send({ features });
  } else return res.status(401).send({ error: "unauthorized" });
});

export default router;
