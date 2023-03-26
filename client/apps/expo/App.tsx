import { NativeNavigation } from "app/navigation/native";
import { Provider } from "app/provider";
import { useFonts } from "expo-font";

export default function App() {
  const [fontsLoaded] = useFonts({
    ChicagoFLF: require("app/assets/fonts/ChicagoFLF.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider>
      <NativeNavigation />
    </Provider>
  );
}
