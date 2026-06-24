import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  activeSection = 'home';
  userId = Number(localStorage.getItem('user_id'));
  username = localStorage.getItem('username');

  // Profile
  profile: any = null;
  isEditingProfile = false;
  profileForm: any = {
    firstName: '', lastName: '', email: '', age: 0,
    homeAddress: '', contactNumber: '', gender: '',
    facebook: '', instagram: '', linkedin: ''
  };

  // Topics
  topics: any[] = [];
  newTopicName = '';

  // Videos
  videos: any[] = [];
  newVideo = { title: '', video_url: '', status: 'watching' };
  showAddVideo = false;

  // Search
  searchQuery = '';
  searchResults: any = null;

  // Budget summary for home
  budgetSummary: any = null;

  currentMonth = new Date().toISOString().slice(0, 7);

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadTopics();
    this.loadVideos();
    this.loadBudgetSummary();
  }

  // =====================
  // PROFILE
  // =====================
  loadProfile() {
    this.http.get(`http://127.0.0.1:8000/students/profile/${this.userId}`).subscribe({
      next: (data: any) => {
        this.profile = data;
        this.profileForm = { ...data };
        this.cdr.detectChanges();
      },
      error: () => {
        this.profile = null;
        this.cdr.detectChanges();
      }
    });
  }

  saveProfile() {
    if (this.profile) {
      this.http.put(`http://127.0.0.1:8000/students/${this.profile.id}`, this.profileForm).subscribe({
        next: () => {
          alert('Profile updated ✅');
          this.isEditingProfile = false;
          this.loadProfile();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.http.post(`http://127.0.0.1:8000/students/profile?user_id=${this.userId}`, this.profileForm).subscribe({
        next: () => {
          alert('Profile created ✅');
          this.isEditingProfile = false;
          this.loadProfile();
        },
        error: (err) => console.error(err)
      });
    }
  }

  // =====================
  // TOPICS
  // =====================
  loadTopics() {
    this.http.get(`http://127.0.0.1:8000/topics/${this.userId}`).subscribe({
      next: (data: any) => {
        this.topics = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  addTopic() {
    if (!this.newTopicName.trim()) return;
    this.http.post('http://127.0.0.1:8000/topics', {
      name: this.newTopicName,
      user_id: this.userId
    }).subscribe({
      next: () => {
        this.newTopicName = '';
        this.loadTopics();
      },
      error: (err) => console.error(err)
    });
  }

  deleteTopic(topicId: number) {
    if (confirm('Remove this topic?')) {
      this.http.delete(`http://127.0.0.1:8000/topics/${topicId}`).subscribe({
        next: () => this.loadTopics(),
        error: (err) => console.error(err)
      });
    }
  }

  // =====================
  // VIDEOS
  // =====================
  loadVideos() {
    this.http.get(`http://127.0.0.1:8000/videos/${this.userId}`).subscribe({
      next: (data: any) => {
        this.videos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  addVideo() {
    if (!this.newVideo.title || !this.newVideo.video_url) {
      alert('Please fill in title and URL');
      return;
    }
    this.http.post('http://127.0.0.1:8000/videos', {
      ...this.newVideo,
      user_id: this.userId
    }).subscribe({
      next: () => {
        this.newVideo = { title: '', video_url: '', status: 'watching' };
        this.showAddVideo = false;
        this.loadVideos();
      },
      error: (err) => console.error(err)
    });
  }

  updateVideoStatus(videoId: number, status: string) {
    this.http.put(`http://127.0.0.1:8000/videos/${videoId}?status=${status}`, {}).subscribe({
      next: () => this.loadVideos(),
      error: (err) => console.error(err)
    });
  }

  deleteVideo(videoId: number) {
    if (confirm('Remove this video?')) {
      this.http.delete(`http://127.0.0.1:8000/videos/${videoId}`).subscribe({
        next: () => this.loadVideos(),
        error: (err) => console.error(err)
      });
    }
  }

  // =====================
  // SEARCH
  // =====================
  search() {
    if (!this.searchQuery.trim()) return;
    const keyword = this.searchQuery.trim().replace(/ /g, '+');
    this.searchResults = {
      query: this.searchQuery,
      youtube: `https://www.youtube.com/results?search_query=${keyword}+tutorial`,
      w3schools: `https://www.w3schools.com/${this.searchQuery.trim().toLowerCase()}/`,

        // =====================
      // YouTube API
      // =====================
      // apiVideos: [] — populated via YouTube Data API v3
      // YOUTUBE_API_KEY = "YOUR_KEY_HERE"
      // endpoint: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${keyword}+tutorial&type=video&key=${YOUTUBE_API_KEY}&maxResults=5`
      // =====================
    };
    this.cdr.detectChanges();
  }

  saveSearchAsTopic() {
    if (!this.searchQuery.trim()) return;
    this.newTopicName = this.searchQuery;
    this.addTopic();
    alert(`"${this.searchQuery}" saved to My Topics ✅`);
  }

  // =====================
  // BUDGET SUMMARY
  // =====================
  loadBudgetSummary() {
    this.http.get(`http://127.0.0.1:8000/budget/overview/${this.userId}?month=${this.currentMonth}`).subscribe({
      next: (data: any) => {
        this.budgetSummary = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  goToBudget() {
    this.router.navigate(['/budget']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}