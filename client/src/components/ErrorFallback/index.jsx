import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cream gap-4 px-6 text-center">
          <span className="text-5xl">🍂</span>
          <h2 className="text-xl font-bold text-warm-brown">문제가 생겼어요</h2>
          <p className="text-sm text-muted max-w-sm leading-relaxed">
            {this.state.error?.message ?? '알 수 없는 오류가 발생했어요.'}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="mt-2 px-6 py-2.5 bg-leaf text-white rounded-xl font-semibold text-sm hover:bg-leaf-dark transition-colors cursor-pointer"
          >
            다시 시도하기
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
