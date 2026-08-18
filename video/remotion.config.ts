import { Config } from "@remotion/cli/config";

// H.264 / MP4 als Standard-Output.
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);

// In dieser Umgebung läuft der Renderer als root -> Chromium braucht --no-sandbox.
Config.setChromiumOpenGlRenderer("angle");
