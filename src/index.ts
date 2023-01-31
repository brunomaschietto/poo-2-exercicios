import express, { Request, Response } from "express";
import cors from "cors";
import { TVideoDB } from "./types";
import { Video } from "./models/Video";
import { VideoDataBase } from "./database/VideoDataBase";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string | undefined;
    // let videosDB;

    // if (q) {
    //   const result: TVideoDB[] = await db("videos").where(
    //     "title",
    //     "LIKE",
    //     `%${q}%`
    //   );
    //   videosDB = result;
    // } else {
    //   const result: TVideoDB[] = await db("videos");
    //   console.log(result);
    //   videosDB = result;
    // }
    const videoDataBase = new VideoDataBase();
    const videosDB = await videoDataBase.findVideos(q);
    const videos: Video[] = videosDB.map(
      (videoDB) =>
        new Video(
          videoDB.id,
          videoDB.title,
          videoDB.duration,
          videoDB.upload_data
        )
    );

    res.status(200).send(videos);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/videos", async (req: Request, res: Response) => {
  try {
    const { id, title, duration } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (typeof title !== "string") {
      res.status(400);
      throw new Error("'name' deve ser string");
    }

    if (typeof duration !== "number") {
      res.status(400);
      throw new Error("'duration' deve ser um number");
    }
    const videoDataBase = new VideoDataBase();
    const videoDBExists = await videoDataBase.findVideosById(id);

    // const [videoDBExists]: TVideoDB[] | undefined[] = await db("videos").where({
    //   id,
    // });

    if (videoDBExists) {
      res.status(400);
      throw new Error("'id' já existe");
    }

    const newVideo = new Video(id, title, duration, new Date().toISOString());

    const newVideoDB: TVideoDB = {
      id: newVideo.getId(),
      title: newVideo.getTitle(),
      duration: newVideo.getDuration(),
      upload_data: newVideo.getUploadData(),
    };

    await videoDataBase.insertVideo(newVideoDB)

    res.status(201).send(newVideo);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// app.put("/videos/:id", async (req: Request, res: Response) => {
//   try {
//     const idToEdit = req.params.id;

//     const newId = req.body.id;
//     const newTitle = req.body.title;
//     const newDuration = req.body.duration;

//     if (newId !== undefined) {
//       if (typeof newId !== "string") {
//         res.status(400);
//         throw new Error("'id' deve ser string");
//       }
//     }

//     if (newTitle !== undefined) {
//       if (typeof newTitle !== "string") {
//         res.status(400);
//         throw new Error("'name' deve ser string");
//       }
//     }

//     if (newDuration !== undefined) {
//       if (typeof newDuration !== "number") {
//         res.status(400);
//         throw new Error("'duration' deve ser number");
//       }
//     }

//     const [videoDB]: TVideoDB[] | undefined[] = await db("videos").where({
//       id: idToEdit,
//     });

//     if (!videoDB) {
//       res.status(400);
//       throw new Error("'id' não encontrado");
//     }

//     const newVideo = new Video(
//       newId,
//       newTitle,
//       newDuration,
//       videoDB.upload_data
//     );

//     const newVideoDB: TVideoDB = {
//       id: newVideo.getId() || videoDB.id,
//       title: newVideo.getTitle() || videoDB.title,
//       duration: isNaN(newVideo.getDuration())
//         ? videoDB.duration
//         : newVideo.getDuration(),
//       upload_data: newVideo.getUploadData(),
//     };

//     await db("videos").update(newVideoDB).where({ id: idToEdit });

//     res.status(201).send(newVideoDB);
//   } catch (error) {
//     console.log(error);

//     if (req.statusCode === 200) {
//       res.status(500);
//     }

//     if (error instanceof Error) {
//       res.send(error.message);
//     } else {
//       res.send("Erro inesperado");
//     }
//   }
// });

// app.delete("/videos/:id", async (req: Request, res: Response) => {
//   try {
//     const idToDelete = req.params.id;
//     const [video] = await db("videos").where({ id: idToDelete });

//     if (!video) {
//       res.status(400);
//       throw new Error("Id não encontrada");
//     }

//     await db("videos").del().where({ id: idToDelete });
//     res.status(200).send({ message: "Video deletado com sucesso!" });
//   } catch (error) {
//     console.log(error);

//     if (req.statusCode === 200) {
//       res.status(500);
//     }

//     if (error instanceof Error) {
//       res.send(error.message);
//     } else {
//       res.send("Erro inesperado");
//     }
//   }
// });
