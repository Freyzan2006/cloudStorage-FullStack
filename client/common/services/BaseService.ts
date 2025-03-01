export class BaseService {
  private urlAPI: string;

  constructor(urlAPI: string) {
    this.urlAPI = urlAPI;
  }

  protected fullUrlAPI(path: string): string {
    return `${this.urlAPI}${path}`;
  }
}
