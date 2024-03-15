import express, { Request, Response } from "express";
import mongoose from "mongoose";
import List from "../models/listModel";
import User from "../models/userModel";
import Location from "../models/locationModel";
import Comment from "../models/commentModel";
import Reply from "../models/replyModel";
import {
  checkId,
  checkNewListValues,
  checkUpdatedListValues,
} from "../utils/checks";
import { checkToken } from "../utils/tokens";
import { IList, IUser } from "../utils/types";
import { apiRequest } from "../utils/fetchFunction";

const router = express.Router();
const populate = [
  { path: "createdBy", select: "username" },
  { path: "locations" },
];

router.get("/allpublic", async (_req: Request, res: Response) => {
  const lists = await List.find({ public: true }).populate(populate);
  res.status(200).json(lists);
});

router.get("/user", async (req: Request, res: Response) => {
  try {
    if (req.header("token") && checkToken(req.header("token"))) {
      const userId = checkToken(req.header("token"));
      const lists = await List.find({ createdBy: userId }).populate(populate);
      res.status(200).json(lists);
    } else res.status(401).json({ error: "unauthorized" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.post("/create", async (req: Request, res: Response) => {
  try {
    if (req.header("token") && checkToken(req.header("token"))) {
      const userId = checkToken(req.header("token"));
      const newList = checkNewListValues(req.body);
      const user = (await User.findById(userId)) as IUser;
      if (!user) throw new Error("No user");

      let result: [{ region: string; subregion: string }] = [
        { region: "", subregion: "" },
      ];

      if (newList.country) {
        // TODO move restcountries url to somwhere else
        const url = `https://restcountries.com/v3.1/translation/${newList.country}`;
        result = await apiRequest<[{ region: string; subregion: string }]>(url);
      }

      const list = new List({
        name: newList.name,
        description: newList.description,
        createdBy: userId,
        defaultview: {
          lat: newList.defaultview.lat,
          lng: newList.defaultview.lng,
          zoom: newList.defaultview.zoom,
        },
        country: newList.country,
        place: newList.place,
        region: result[0] ? result[0].region : "unknown",
        subregion: result[0] ? result[0].subregion : "unknown",
        public: newList.public,
        date: Date.now(),
      });

      const savedList = await list.save();
      user.lists = user.lists.concat(savedList);
      await user.save();
      res.status(200).json(savedList);
    } else res.status(401).send({ error: "unauthorized" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.put("/update/:id", async (req: Request, res: Response) => {
  try {
    if (req.header("token") && checkToken(req.header("token"))) {
      const userId = checkToken(req.header("token"));
      const body = checkUpdatedListValues(req.body);
      const list = (await List.findById(req.params.id)) as IList;
      if (!list) throw new Error("No list found.");
      else if (list.createdBy.toString() === userId) {
        const updated = (await List.findByIdAndUpdate(
          { _id: req.params.id },
          body,
          { new: true }
        )) as IList;
        res.json(updated);
      } else res.status(401).send({ error: "unauthorized" });
    } else res.status(401).send({ error: "unauthorized" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    if (req.header("token") && checkToken(req.header("token"))) {
      const userId = checkToken(req.header("token"));
      const list = (await List.findById(req.params.id)) as IList;
      if (!list) throw new Error("No list found");
      if (list.createdBy.toString() === userId) {
        await List.findOneAndRemove({ _id: req.params.id });
        await Location.deleteMany({ list: req.params.id });
        await Comment.deleteMany({ list: req.params.id });
        await Reply.deleteMany({ listId: req.params.id });
        res.status(204).send({ success: `${list.name} deleted` });
      } else {
        res.status(401).send({ error: "unauthorized" });
      }
    } else res.status(401).send({ error: "unauthorized" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.post("/favorite/:id", async (req: Request, res: Response) => {
  try {
    if (req.header("token") && checkToken(req.header("token"))) {
      const userId = checkToken(req.header("token"));
      const listId = checkId(req.params.id);
      const user = (await User.findById(userId)) as IUser;
      const list = (await List.findById(listId).populate(populate)) as IList;

      if (user && list && userId && mongoose.isValidObjectId(userId)) {
        if (!list.favoritedBy.some((x) => x.equals(userId))) {
          user.favorites = user.favorites.concat(list._id);
          const objectId = new mongoose.Types.ObjectId();
          list.favoritedBy = list.favoritedBy.concat(objectId);
        } else {
          user.favorites = user.favorites.filter((x) => !x.equals(listId));
          list.favoritedBy = list.favoritedBy.filter((x) => !x.equals(userId));
        }
        await user.save();
        await list.save();
        res.json(list);
      } else throw new Error("List or user error");
    } else res.status(401).send({ error: "unauthorized" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
