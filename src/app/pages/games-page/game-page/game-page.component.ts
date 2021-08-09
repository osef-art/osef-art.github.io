import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubRequestService } from 'src/app/services/http-request.service';
import { MdToHtmlParserService } from 'src/app/services/md-to-html-parser.service';
import { AppComponent } from 'src/app/app.component';
import { Kind } from 'src/models/models';
import * as marked from 'marked';
import { PageScrollerService } from 'src/app/services/page-scroller.service';

@Component({
  selector: 'game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  gameId !: string;
  readmeHTML !: string;

  constructor(
    private githubRequester : GithubRequestService,
    private scroller : PageScrollerService,
    private parser : MdToHtmlParserService,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    const name = this.route.snapshot.paramMap.get('id');
    if (name) this.gameId = name;

    this.scroller.scrollToTop();
    AppComponent.setPageKind(Kind.GAMES);
    this.getGameReadmeFile();
  }

  get Kind() : typeof Kind {
    return Kind;
  }

  getGameReadmeFile() {
    const githubURL : string = "(https://raw.githubusercontent.com/osef-art/" + this.gameId + "/main/$1";

    this.githubRequester
      .getReadMeFrom(this.gameId)
      .subscribe(data => {
        this.readmeHTML = this.parser.parsedWithRules(data, {
          [githubURL] : /\(([a-zA-Z0-9_\-/]+\.(png|jpg|gif))/
        });
        this.readmeHTML = marked.setOptions({}).parse(this.readmeHTML);
      });
  }

  scrollTo(elm : HTMLElement) {
    this.scroller.scrollTo(elm);
  }
}
