const tableRow = {
  typography: {
    fontFamily: "Noto Sans JP",
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": {
            backgroundColor: "#FBFBFB",
          },
        },
      },
    },
  },
}

export default tableRow
