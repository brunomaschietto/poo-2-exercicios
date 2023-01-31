import { TVideoDB } from "../types";
import { BaseDataBase } from "./BaseDataBase";

export class VideoDataBase extends BaseDataBase {
  public static TABLE_VIDEOS = "videos";
  public async findVideos(q: string | undefined) {
    let videosDB;

    if (q) {
      const result: TVideoDB[] = await BaseDataBase.connection(
        VideoDataBase.TABLE_VIDEOS
      ).where("title", "LIKE", `%${q}%`);
      videosDB = result;
    } else {
      const result: TVideoDB[] = await BaseDataBase.connection(
        VideoDataBase.TABLE_VIDEOS
      );
      console.log(result);
      videosDB = result;
    }
    return videosDB;
  }
  public async findVideosById(id: string) {
    const [videoDBExists]: TVideoDB[] | undefined[] =
      await BaseDataBase.connection(VideoDataBase.TABLE_VIDEOS).where({
        id,
      });
    return videoDBExists;
  }
  public async insertVideo(newVideoDB: TVideoDB) {
    await BaseDataBase.connection(VideoDataBase.TABLE_VIDEOS).insert(
      newVideoDB
    );
  }
}
