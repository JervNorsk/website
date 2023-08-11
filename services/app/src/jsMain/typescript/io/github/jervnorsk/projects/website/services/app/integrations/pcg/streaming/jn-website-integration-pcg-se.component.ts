import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: '[jn-website-app]',
  templateUrl: './jn-website-integration-pcg-se.component.html',
  styleUrls: ['./jn-website-integration-pcg-se.component.sass'],
  host: {
    integration: "pcg-se"
  }
})
export class JnWebsiteIntegrationPcgSe {

  constructor(
      private title: Title
  ) {
    title.setTitle(`${title.getTitle()} | Pokemon Community Streaming Extension`)
  }
}
