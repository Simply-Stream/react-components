import { Item } from "./item";

export class Game implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public id?: any,
    public name?: any,
    public boxArt?: any,
    public height?: any,
    public width?: any
  ) {
    this["@id"] = _id;
  }
}
