import java.io.*;
import java.time.*;

import static java.lang.System.*;
import static java.lang.Thread.*;

class Server {
	public static void main(String[] argv) {
		print("Starting fake Minecraft server");
		pause();
		print("Done");
		var bufferedReader = new BufferedReader(new InputStreamReader(in));
		try {
			while(true) {
				String command = bufferedReader.readLine();
				switch(command) {
					case "stop":
						print("Stopping fake Minecraft server");
						pause();
						exit(0);
					default:
						print("Received command: " + command);
						break;
				}
			}
		} catch (IOException ioException) {
			out.println(ioException);
			exit(1);
		}
	}

	private static void print(String line) {
		out.println(ZonedDateTime.now().toString() + ": " + line);
	}

	private static void pause() {
		try {
			sleep(100);
		} catch (InterruptedException interruptedException) {
		}
	}
}
