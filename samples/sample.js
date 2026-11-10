import { Controller } from "@hotwired/stimulus";

// Splits a specimen and distributes tests
export default class extends Controller {
  static targets = ["count", "list"];

  async connect() {
    const response = await fetch(`/api/v2/specimens/${this.data.get("id")}`);
    const { tests = [], total } = await response.json();
    this.countTarget.textContent = total > 0 ? `${total} tests` : "None";
    if (/^\d+$/.test(total) && this.listTarget !== null) {
      tests.forEach((test, i) => console.log(i, test.name));
    }
  }
}
