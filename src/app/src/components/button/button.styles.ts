import { StyleSheet } from "react-native";

export const PrimaryStyles = StyleSheet.create({
  labelStyle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 500,
    color: "#FFFFFF",
  },
  containerStyle: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#EC5B13",
  },
});

export const SecondaryStyles = StyleSheet.create({
  labelStyle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 500,
    color: "#EC5B13",
  },
  containerStyle: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#ec5b136c",
  },
});

export const TertiaryStyles = StyleSheet.create({
  labelStyle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 700,
    color: "#EC5B13",
    textTransform: "uppercase",
  },
  containerStyle: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export const PrimaryStylesOutline = StyleSheet.create({
  labelStyle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 500,
    color: "#EC5B13",
  },
  containerStyle: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EC5B13",
    backgroundColor: "#FFFFFF",
  },
});
