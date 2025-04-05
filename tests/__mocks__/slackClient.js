module.exports = {
  chat: {
    postMessage: jest.fn().mockResolvedValue({ ok: true }),
    update: jest.fn().mockResolvedValue({ ok: true })
  },
  conversations: {
    open: jest.fn().mockResolvedValue({
      channel: { id: "mock-dm-channel-id" } // ✅ This is important!
    })
  }
};
