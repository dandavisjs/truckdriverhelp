module.exports = {
  reactStrictMode: true,
  redirects() {
    return [
      process.env.MAINTENANCE_MODE === "1"
        ? { source: "/((?!maintenance)(?!_next)(?!static).*)", destination: "/comingsoon", permanent: false }
        : null,
    ].filter(Boolean);
  }
}
