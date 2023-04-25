import { NextResponse } from "next/server";
import fsPromise from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  const jsonDirectory = path.join(process.cwd(), "json");
  const fileContents = await fsPromise.readFile(
    jsonDirectory + "/busca.json",
    "utf8"
  );
  const data = await JSON.parse(fileContents);
  return NextResponse.json(data);
}
