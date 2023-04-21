export async function GET(request: Request) {
  // const jsonDirectory = path.join(process.cwd(), "json");
  //Read the json data file data.json
  // const fileContents = await fs.readFile("/public/busca.json", "utf8");
  // const a = await fetch("/public/data.json");
  // console.log(a);
  return new Response("Hi!");
}
