const selectBox = {
  typography: {
    fontFamily: "Noto Sans JP",
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          display: "flex",
          alignItems: "center",
          paddingTop: 0,
          paddingBottom: 0,
          minHeight: "32px",
          backgroundColor: "#FFFFFF",
        },
      },
    },
  },
}

export default selectBox
