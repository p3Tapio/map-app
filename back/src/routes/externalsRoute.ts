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

    console.log("response", response);

    if (!response || !response.features[0] || !response.features[0].geometry) {
      res.status(400).send({ error: "no address found" });
    }

    const { geometry } = response.features[0];

    res.status(200).json({
      coordinates: {
        lat: geometry.coordinates[1],
        lng: geometry.coordinates[0],
      },
    });
  } else res.status(401).send({ error: "unauthorized" });
});


export default router;
