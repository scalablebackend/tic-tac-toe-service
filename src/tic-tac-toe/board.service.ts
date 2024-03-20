export class BoardService {
  private history: string[][] = [];

  findHistory() {
    return this.history;
  }

  setHistory(history: string[][]): void {
    this.history = history;
  }
}
