import { padCode } from "./util";

const ep = "https://www.googleapis.com/upload/drive/v3"
const fileName = "random-unique-codes.txt"

export class Storage {
  fileId: string | undefined;
  codes: Set<number> = new Set();

  public async load() {
    this.codes.clear()

    const listResponse = await gapi.client.drive.files.list({ 'fields': "files(id, name, trashed)", q: `name='${fileName}' and trashed=false` })
    const files = listResponse.result.files;
    if (!files || files.length <= 0)
      return

    this.fileId = files[0].id
    if (!this.fileId)
      return

    const fileResponse = await gapi.client.drive.files.get({ fileId: this.fileId, alt: "media", fields: "id" })

    switch (listResponse.status) {
      case 200:
        this.unserialize(fileResponse.body);
        break;
      default:
        throw new Error('Error reading file, ' + fileResponse);
    }
  }

  public async add(codes: number[]): Promise<void> {
    for (const code of codes)
      this.codes.add(code)
  }

  public async save() {
    if (this.fileId === undefined)
      await this.createFile();

    const content = this.serialize()

    const result = await gapi.client.request({
      path: `${ep}/files/` + this.fileId,
      method: "PATCH",
      headers: {
        'Content-Type': "text/plain",
        "Content-Length": content.length,
      },
      params: { uploadType: "media" },
      body: content
    })

    switch (result.status) {
      case 200:
        break;
      default:
        throw new Error('Error updating database file, ' + result);
    }
  }

  private async createFile() {
    const createResponse = await gapi.client.drive.files.create({
      resource: {
        name: fileName,
        mimeType: 'text/plain',
        parents: ["root"],
      },
      fields: "id"
    });

    switch (createResponse.status) {
      case 200:
        this.fileId = createResponse.result.id;
        break;
      default:
        throw new Error('Error creating database file, ' + createResponse);
    }
  }

  private serialize() {
    this.deleteInvalidCodes();
    return Array.from(this.codes.keys()).map(code => padCode(code)).join("\n");
  }

  private unserialize(contents: string) {
    this.codes = new Set(contents.split("\n").map(code => parseInt(code)));
    this.deleteInvalidCodes();
  }

  private deleteInvalidCodes() {
    this.codes.delete(NaN);
    this.codes.delete(0);
  }
}