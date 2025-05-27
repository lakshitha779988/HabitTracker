"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AuthProvider, useAuth } from "./src/context/AuthContext"
import { HabitProvider } from "./src/context/HabitContext"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import HabitListScreen from "./src/screens/HabitListScreen"
import CreateHabitScreen from "./src/screens/CreateHabitScreen"
import ProgressScreen from "./src/screens/ProgressScreen"
import CalendarScreen from "./src/screens/CalendarScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import { StatusBar, Text } from "react-native"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
)

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        let emoji: string

        if (route.name === "Habits") {
          emoji = focused ? "📋" : "📝"
        } else if (route.name === "Create") {
          emoji = focused ? "➕" : "✏️"
        } else if (route.name === "Progress") {
          emoji = focused ? "📊" : "📈"
        } else if (route.name === "Calendar") {
          emoji = focused ? "📅" : "🗓️"
        } else {
          emoji = focused ? "👤" : "👥"
        }

        // Return a valid React element
        return (
          <Text style={{ fontSize: 24 }}>
            {emoji}
          </Text>
        )
      },
      tabBarActiveTintColor: "#6366f1",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
      tabBarLabelStyle: { fontSize: 12 },
    })}
  >
    <Tab.Screen name="Habits" component={HabitListScreen} />
    <Tab.Screen name="Create" component={CreateHabitScreen} />
    <Tab.Screen name="Progress" component={ProgressScreen} />
    <Tab.Screen name="Calendar" component={CalendarScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
)

const AppNavigator = () => {
  const { user } = useAuth()

  return <NavigationContainer>{user ? <MainTabs /> : <AuthStack />}</NavigationContainer>
}

const App = () => {
  return (
    <AuthProvider>
      <HabitProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <AppNavigator />
      </HabitProvider>
    </AuthProvider>
  )
}

export default App
