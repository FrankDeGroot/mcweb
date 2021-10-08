import java.io.*;
import java.time.*;
import java.time.format.*;
import java.util.*;

import static java.lang.System.*;
import static java.lang.Thread.*;

class Server {
	public static void main(String[] argv) {
		try {
			print("Starting fake Minecraft server");
			var notACleanExitFile = new File("NotACleanExit");
			notACleanExitFile.createNewFile();
			pause();
			print("Done");
			while (true) {
				var scanner = new Scanner(bufferedReader.readLine()).useDelimiter(" ");
				if (scanner.hasNext()) {
					var command = scanner.next();
					switch (command) {
						case "stop":
							print("Stopping fake Minecraft server");
							pause();
							notACleanExitFile.delete();
							exit(0);
						case "help":
							print("Help! Help! Oh, this is help.");
							break;
						case "gamerule":
							if (scanner.hasNext()) {
								var gamerule = scanner.next();
								if (scanner.hasNext()) {
									var value = scanner.next();
									gamerules.put(gamerule, value);
									print("Gamerule " + gamerule + " is now set to: " + value);
								} else {
									var value = gamerules.containsKey(gamerule) ? gamerules.get(gamerule) : false;
									print("Gamerule " + gamerule + " is currently set to: " + value);
								}
							} else {
								print("Unknown or incomplete command, see below for error");
								print("gamerule<--[HERE]");
							}
							break;
						default:
							print("Received command: " + command);
							break;
					}
				}
				scanner.close();
			}
		} catch (IOException ioException) {
			print(ioException.toString());
			exit(1);
		}
	}

	static BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(in));

	static HashMap<String, Object> gamerules = new HashMap<>();

	static {
		gamerules.put("maxCommandChainLength", 0);
		gamerules.put("maxEntityCramming", 0);
		gamerules.put("playersSleepingPercentage", 0);
		gamerules.put("randomTickSpeed", 0);
		gamerules.put("spawnRadius", 0);
	}

	static DateTimeFormatter timeOnly = DateTimeFormatter.ofPattern("HH:mm:ss");

	static void print(String line) {
		out.println("[" + ZonedDateTime.now(ZoneOffset.UTC).format(timeOnly) + "] [Fake Thread/INFO]: " + line);
	}

	static void pause() {
		try {
			sleep(100);
		} catch (InterruptedException interruptedException) {
		}
	}
}
