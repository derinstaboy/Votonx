// theme.js
import { extendTheme } from "@chakra-ui/react";

const colourTheme = extendTheme({
    colors: {
        pt1: "#82C8E2", 
        pt2: "#F5EEA5", 
        pt3: "#FF625E", 
        pt4: "#191d26",
        pt5: "#1b222c",
    },
    gradients: {
        pg1: "linear(to-r, pt1, pt2)",
        pg2: "linear(to-r, pt3, pt4)",
        pg3: "linear(to-r, pt4, pt5)",
    },
    fonts: {
        body: "Rubik, sans-serif",
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: "md",
                fontWeight: "semibold",
                transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
                p: 4,
                color: "white",
            },
            variants: {
                primary: {
                    bg: "#12151c",
                    color: "white",
                    boxShadow: "dark-lg",
                    _hover: { bg: "#f0c415", 
                },
                    _active: {
                        bg: "#f0c415",
                        transform: "scale(0.98)",
                        borderColor: "#bec3c9",
                    },
                },
                secondary: {
                    bg: "#12151c",
                    borderColor: "#661b1c",
                    _active: {
                        bg: "#82C8E2",
                        transform: "scale(0.98)",
                    },
                    _hover: {
                        bg: "#82C8E2",                         
                    borderColor: "#e97856",
                }
           },
            },
            sizes: {
                xs: {
                    fontSize: "8px",
                    px: "6px",
                    py: "4px",
                    height: "28px",
                },
                sm: {
                    fontSize: "10px",
                    px: "8px",
                    py: "6px",
                    height: "28px",
                },
                md: {
                    fontSize: "12px",
                    px: "10px",
                    py: "8px",

                    height: "36px",
                },
                lg: {
                    fontSize: "14px",
                    px: "12px",
                    py: "10px",
                    height: "42px",
                },
            },
        },
    }
});

export default colourTheme;
