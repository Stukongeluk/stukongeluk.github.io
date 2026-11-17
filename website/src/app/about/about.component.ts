import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
})
export class AboutComponent implements AfterViewInit {
  @ViewChildren('hobbyVideo') private hobbyVideos!: QueryList<ElementRef<HTMLVideoElement>>;

  ngAfterViewInit(): void {
    // Angular creates <video> elements via createElement + setAttribute, which does NOT set the
    // `muted` DOM property. Browsers then treat the video as unmuted and block autoplay.
    // Force the property and kick off playback explicitly.
    this.hobbyVideos.forEach(({ nativeElement: video }) => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const play = () => video.play().catch(() => { /* blocked (e.g. Low Power Mode) - ignore */ });
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        play();
      } else {
        video.addEventListener('canplay', play, { once: true });
      }
    });
  }
}
