import { Component, OnInit, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SimpleQRCode } from './qr-code.util';

export interface ActivityPavilion {
  id: string;
  title: string;
  japaneseTitle: string;
  tagline: string;
  description: string;
  revealedDescription: string;
  icon: string;
  badge: string;
  accentColor: string;
  rotationClass: string;
}

export interface TimetableEntry {
  time: string;
  title: string;
  subtitle: string;
  revealedSubtitle: string;
  duration?: string;
  isSpecial?: boolean;
  icon: string;
}

export interface ConNote {
  icon: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-convention',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './convention.component.html',
  styleUrls: ['./convention.component.css']
})
export class ConventionComponent implements OnInit {
  // ========================================================
  // REVEAL LOGIC: 27th September at 13:00 GMT+2
  // ========================================================
  public manualRevealOverride = signal<boolean | null>(null);

  // Target reveal date: September 27th, 13:00 GMT+2 (UTC+2)
  public readonly targetDate = new Date(`${new Date().getFullYear()}-09-27T13:00:00+02:00`);

  // Target URL that the QR code ALWAYS encodes
  public readonly qrTargetUrl = 'https://www.youtube.com/watch?v=Aq5WXmQQooo';

  public isRevealed = computed(() => {
    const override = this.manualRevealOverride();
    if (override !== null) {
      return override;
    }
    const now = new Date();
    return now >= this.targetDate;
  });

  // Localhost test switch only
  public isLocalhost = signal(false);

  // Countdown
  public daysRemaining = 0;
  public hoursRemaining = 0;
  public minutesRemaining = 0;

  // Interactive Mascot Shake & Confetti
  public isMascotPoked = signal(false);
  public showConfetti = signal(false);

  // ========================================================
  // FESTIVAL ACTIVITIES (Includes Secret Prize Activity)
  // ========================================================
  public readonly activities: ActivityPavilion[] = [
    {
      id: 'karaoke',
      title: 'Karaoke Main Stage',
      japaneseTitle: 'カラオケ',
      tagline: 'Belt out anime anthems & vocaloids!',
      description: 'Grab the golden mic! Sing your heart out to classic anime openings, high-energy J-rock, and iconic vocaloid tracks. Duets and group sing-alongs welcome!',
      revealedDescription: 'Grab the golden mic at RoNi-con! Sing your heart out to classic anime openings, high-energy J-rock, and iconic vocaloid tracks. Duets and group sing-alongs welcome!',
      icon: '🎤',
      badge: 'Main Stage',
      accentColor: 'from-cyan-500 to-blue-600',
      rotationClass: '-rotate-1 hover:rotate-0'
    },
    {
      id: 'food',
      title: 'Dutch Food & Snacks',
      japaneseTitle: '美味しいスナック',
      tagline: 'Dutch dinner & snacks like chips!',
      description: 'We will have Dutch food for dinner and snacks like chips to munch on (not sure yet if we have frikandellen etc., but good food is guaranteed)!',
      revealedDescription: 'We will have Dutch food for dinner and snacks like chips to fuel the RoNi-con party (not sure yet if we have frikandellen etc., but good food is guaranteed)!',
      icon: '🍟',
      badge: 'Snack Bar',
      accentColor: 'from-teal-400 to-cyan-500',
      rotationClass: 'rotate-1 hover:rotate-0'
    },
    {
      id: 'secret',
      title: 'Secret Activity (Win a Prize!)',
      japaneseTitle: '秘密の賞品',
      tagline: 'Mystery challenge with an awesome prize!',
      description: 'We have a special secret activity planned where you can compete to win an awesome prize! Keep your eyes open during the convention for the surprise announcement.',
      revealedDescription: 'We have a special secret activity planned where you can compete to win an awesome prize! Keep your eyes open during RoNi-con for the surprise announcement.',
      icon: '🎁',
      badge: 'Win a Prize!',
      accentColor: 'from-amber-400 to-orange-500',
      rotationClass: '-rotate-1 hover:rotate-0'
    },
    {
      id: 'chill',
      title: 'Having Fun with Friends',
      japaneseTitle: '友達とお祝い',
      tagline: 'Celebrating Rosalief & Niels their birthdays!',
      description: 'The heart of the convention! A cozy gathering dedicated to celebrating Rosalief and Niels their birthdays—relax in the lounge, chat anime, snap fun photos, and celebrate together.',
      revealedDescription: 'The heart of RoNi-con! Dedicated to celebrating Rosalief and Niels their birthdays—relax in the lounge, chat anime, snap fun photos, and make lasting memories together.',
      icon: '✨',
      badge: 'Birthday Lounge',
      accentColor: 'from-cyan-400 to-sky-500',
      rotationClass: 'rotate-1 hover:rotate-0'
    }
  ];

  // ========================================================
  // CONVENTION NOTES & GOOD TO KNOW
  // ========================================================
  public readonly conventionNotes: ConNote[] = [
    {
      icon: '🍻',
      title: 'BYOB (Alcohol)',
      text: 'Bring your own booze! Plenty of soft drinks are provided.'
    },
    {
      icon: '🚗',
      title: 'Free Parking',
      text: 'Parking is free in the streets!'
    },
    {
      icon: '🚆',
      title: 'Public Transport',
      text: 'Easy to reach via public transport'
    },
    {
      icon: '👗',
      title: 'Cosplay Friendly',
      text: 'Changing room for cosplay is available!'
    }
  ];

  // ========================================================
  // TIMETABLE: Starts at 14:00, 14:30 Opening ceremony, Free for all, 21:00 Concludes
  // ========================================================
  public readonly timetable: TimetableEntry[] = [
    {
      time: '14:00',
      title: 'Doors Open (Convention Starts)',
      subtitle: 'The convention officially starts! Doors open, grab your badges, and settle in.',
      revealedSubtitle: 'RoNi-con officially starts! Doors open, grab your badges, and settle in.',
      duration: 'Doors Open',
      icon: '🚪'
    },
    {
      time: '14:30 - 14:45',
      title: 'Opening Ceremony',
      subtitle: 'The 15-minute grand kickoff! Welcome speech and kicking off the birthday celebration.',
      revealedSubtitle: 'The 15-minute grand kickoff! Welcome speech, badge greetings, and ribbon-cutting for RoNi-con - First edition!',
      duration: '15 mins',
      isSpecial: true,
      icon: '🎊'
    },
    {
      time: '14:45 - 21:00',
      title: 'Free For All (Foods, Karaoke & Fun)',
      subtitle: 'Free for all! Enjoy Dutch food for dinner, snacks like chips, karaoke, cold drinks, secret prize challenge, and celebrating together.',
      revealedSubtitle: 'Free for all! Enjoy Dutch food for dinner, snacks like chips, karaoke, cold drinks, secret prize challenge, and having fun at RoNi-con.',
      duration: '6h 15m',
      icon: '🎉'
    },
    {
      time: '21:00',
      title: 'Convention Concludes',
      subtitle: 'The anime convention officially wraps up for the night. Thank you for celebrating with us!',
      revealedSubtitle: 'RoNi-con (the anime con) officially wraps up! Thank you for making the first edition unforgettable!',
      duration: 'Closing',
      isSpecial: true,
      icon: '🌙'
    }
  ];

  // ========================================================
  // QR TICKET GENERATOR
  // ========================================================
  public attendeeInput = '';
  public attendeeTicketName = 'Convention Guest';
  public attendeePassId = 'PASS-1ST-4290';
  public qrSvg: SafeHtml | null = null;
  public qrErrorMessage = '';
  public qrSuccessMessage = '';

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const hostname = window.location.hostname;
      this.isLocalhost.set(hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1');
    }
    this.calculateCountdown();
    this.renderDefaultQr();
  }

  public calculateCountdown(): void {
    const now = new Date();
    const diff = this.targetDate.getTime() - now.getTime();
    if (diff > 0) {
      this.daysRemaining = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.hoursRemaining = Math.floor((diff / (1000 * 60 * 60)) % 24);
      this.minutesRemaining = Math.floor((diff / (1000 * 60)) % 60);
    } else {
      this.daysRemaining = 0;
      this.hoursRemaining = 0;
      this.minutesRemaining = 0;
    }
  }

  public toggleReveal(): void {
    this.manualRevealOverride.set(!this.isRevealed());
    this.refreshCurrentPass();
    this.triggerConfetti();
  }

  public resetDateAuto(): void {
    this.manualRevealOverride.set(null);
    this.refreshCurrentPass();
  }

  public pokeMascot(): void {
    this.isMascotPoked.set(true);
    setTimeout(() => this.isMascotPoked.set(false), 800);
  }

  public triggerConfetti(): void {
    this.showConfetti.set(true);
    setTimeout(() => this.showConfetti.set(false), 3000);
  }

  public onGenerateTicket(): void {
    this.qrErrorMessage = '';
    this.qrSuccessMessage = '';

    const raw = (this.attendeeInput || '').trim();

    if (!raw) {
      this.qrErrorMessage = 'Please enter your name or a funny nickname!';
      return;
    }

    // Strict sanitization: reject links & URLs in the attendee name input
    const linkRegex = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|nl|net|org|io|dev|app|gg|xyz|me|be|de|uk|fr)\b|ftp:\/\/|mailto:|\/\/[^\s]+)/i;
    if (linkRegex.test(raw)) {
      this.qrErrorMessage = '⚠️ Links and URLs are not permitted! Please enter only your name or funny alias.';
      return;
    }

    // Strip HTML tags and special chars
    let sanitized = raw.replace(/<[^>]*>/g, '').replace(/[<>{}"\\]/g, '').trim();

    if (sanitized.length > 35) {
      sanitized = sanitized.substring(0, 35);
    }

    if (!sanitized) {
      this.qrErrorMessage = 'Please enter a valid name or nickname.';
      return;
    }

    this.attendeeTicketName = sanitized;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = this.isRevealed() ? 'RONI-1ST' : 'PASS-1ST';
    this.attendeePassId = `${prefix}-${randomSuffix}`;

    this.buildAndRenderQr();
    this.qrSuccessMessage = '🎉 Pass generated!';
    this.triggerConfetti();
  }

  private refreshCurrentPass(): void {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = this.isRevealed() ? 'RONI-1ST' : 'PASS-1ST';
    this.attendeePassId = `${prefix}-${randomSuffix}`;
    this.buildAndRenderQr();
  }

  private renderDefaultQr(): void {
    this.buildAndRenderQr();
  }

  private buildAndRenderQr(): void {
    // The QR code itself always links to https://www.youtube.com/watch?v=Aq5WXmQQooo
    this.generateQrSvg(this.qrTargetUrl);
  }

  private generateQrSvg(payload: string): void {
    try {
      const matrix = SimpleQRCode.generate(payload);
      const svg = matrix.toSvg({
        margin: 2,
        darkColor: '#052835',
        lightColor: '#ffffff',
        sizePx: 220
      });
      this.qrSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
    } catch (err) {
      console.error('Error generating QR', err);
      this.qrErrorMessage = 'Failed to generate QR code.';
    }
  }
}
