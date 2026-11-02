import { Component } from 'react';
import { Btn, Eyebrow } from './ui';

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error, info) { console.error(error, info); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ivory px-6 text-center">
        <Eyebrow>Kesar Mahal</Eyebrow>
        <h1 className="font-display text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.05] text-maroon">Something went astray</h1>
        <p className="max-w-md text-ink">We hit an unexpected snag. Please reload the page and try again.</p>
        <Btn onClick={() => window.location.reload()}>Reload</Btn>
      </div>
    );
  }
}
