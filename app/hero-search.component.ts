import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

//import 'rxjs/add/observable/of';

//import 'rxjs/add/operator/debounceTime';
//import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  moduleId: module.id,
  selector: 'hero-search',
  templateUrl: 'hero-search.component.html',
  styleUrls: ['hero-search.component.css'],
  providers: [HeroSearchService]
})

export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>();
  
  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router){}

  // push a sarch term into the observabe stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes = this.searchTerms
      .debounceTime(300)        // wait for a 300ms pause in events
      .distinctUntilChanged()   // ingore if next search term is same as prev
      .switchMap(term => term   // swtich to new observable each time
        ? this.heroSearchService.search(term) // use http search observable
        : Observable.of<Hero[]>([]))  // or use a new empty if no search term
      .catch( error => {
        // TODO: real error handling
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }

  gotoDetail(hero: Hero): void {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }
}
