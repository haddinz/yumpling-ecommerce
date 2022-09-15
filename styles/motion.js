import React from "react";
import { motion } from "framer-motion";

const easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUpMotion = {
  initial: {
    y: 60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const staggerMotion = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      duration: 1,
    },
  },
};

const imgJiggle = {
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { delay: 0.2 },
};

const offScreen = {
  y: 60,
  opacity: 0,
};

const onscreen = {
  y: 0,
  opacity: 1,
  transition: {
    duration: 0.9,
    ease: easing,
  },
};

const tapHover = {
   whileTap: { scale: 0.96 },
   whileHover: { scale: 1.05 }
}

function parent({ children }) {
  return (
    <motion.div
      exit={{ opacity: 0, delay: 0.2 }}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}

function stagger({ children }) {
  return <motion.div variants={staggerMotion}>{children}</motion.div>;
}

function scroll({ children }) {
  return (
    <motion.div
      whileInView={onscreen}
      viewport={{ once: false, amount: 0.3}}
      initial={offScreen}
    >
      {children}
    </motion.div>
  );
}

function fadeInUp({ children }) {
  return <motion.div variants={fadeInUpMotion}>{children}</motion.div>;
}

function img({ children }) {
  return <motion.div variants={imgJiggle}>{children}</motion.div>;
}

function tap({ children }) {
  return <motion.div variants={tapHover}>{children}</motion.div>;
}

const Motion = { parent, stagger, fadeInUp, img, scroll, tap};
export default Motion;
