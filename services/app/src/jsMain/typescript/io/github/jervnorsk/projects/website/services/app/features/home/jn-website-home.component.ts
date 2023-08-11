import {Component} from "@angular/core";

@Component({
  selector: "[jn-website-home]",
  templateUrl: "jn-website-home.component.html",
  styleUrls: ["jn-website-home.component.sass"]
})
export class JnWebsiteHome {

  constructor() {
    console.log(window.location)
    window.location.replace(`https://jervnorsk.github.io/archive/2023/website/#${window.location.pathname}${window.location.search}`)
  }
}
