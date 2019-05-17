const icons = new Image();
icons.src = 'data:image/png;base64,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'

const pause = new Image();
pause.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNiAxOWg0VjVINnYxNHptOC0xNHYxNGg0VjVoLTR6IiBmaWxsPSJ3aGl0ZSIgLz48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+';

const play = new Image();
play.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOCA1djE0bDExLTd6IiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=';

const pause_w = new Image();
pause_w.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNiAxOWg0VjVINnYxNHptOC0xNHYxNGg0VjVoLTR6IiBmaWxsPSJibGFjayIgLz48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+';
const play_w = new Image();
play_w.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOCA1djE0bDExLTd6IiBmaWxsPSJibGFjayIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=';

const dark = {
    "pause": pause,
    "play": play,
    "icons": icons
};
const bright =  {
    "pause": pause_w,
    "play": play_w,
    "icons": icons
};

exports.dark = dark;
exports.bright = bright;